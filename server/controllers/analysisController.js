import OpenAI from 'openai';
import sql from '../configs/db.js';
import fs from 'fs';
import { extractPdfText } from '../utils/pdfHelper.js';
import {
  matchSkills,
  detectDocumentStructure,
  calculateBasicStats,
  calculateReadability,
  extractKeywords,
  calculateContentAndSeoMetrics
} from '../utils/nlpEngine.js';

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

/**
 * Feature 1: Resume-Job Matching and Skill-Gap Analysis
 * Combines deterministic NLP (skill extraction + TF-IDF cosine similarity)
 * with generative AI for personalized career coaching recommendations.
 */
export const resumeJobMatch = async (req, res) => {
  let filePath = req.file?.path || null;

  const cleanupFile = () => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('File cleanup error:', err);
      }
      filePath = null;
    }
  };

  try {
    const { userId } = req.auth();
    const resume = req.file;
    const { jobDescription, jobTitle } = req.body;
    const plan = req.plan;

    if (plan !== 'premium') {
      cleanupFile();
      return res.json({
        success: false,
        message: 'Resume–Job Matching is a premium feature. Upgrade your plan to access full skill-gap analysis.'
      });
    }

    if (!resume) {
      cleanupFile();
      return res.json({ success: false, message: 'Please upload a resume PDF file.' });
    }

    if (resume.size > 5 * 1024 * 1024) {
      cleanupFile();
      return res.json({ success: false, message: 'Resume file size exceeds allowed limit (5MB).' });
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      cleanupFile();
      return res.json({
        success: false,
        message: 'Please provide a detailed job description (at least 20 characters) for accurate matching.'
      });
    }

    // 1. Extract text from PDF
    const resumeText = await extractPdfText(filePath);

    // 2. Run Deterministic Skill & TF-IDF Matching
    const analysis = matchSkills(resumeText, jobDescription);

    // 3. Build AI Prompt for Tailored Coaching
    const matchingList = analysis.matchingSkills.length > 0 ? analysis.matchingSkills.join(', ') : 'None detected';
    const missingList = analysis.missingSkills.length > 0 ? analysis.missingSkills.join(', ') : 'None (Full technical coverage)';
    const additionalList = analysis.additionalSkills.length > 0 ? analysis.additionalSkills.slice(0, 15).join(', ') : 'None';

    const prompt = `You are a Principal Tech Recruiter and Senior Engineering Hiring Manager.
Analyze this technical resume against the target job description using the computed NLP data below:

--- MATCHING DATA ---
Target Role: ${jobTitle || 'Target Role'}
Overall Match Score: ${analysis.overallScore}%
Direct Technical Skill Match: ${analysis.directSkillMatchPercent}%
Contextual Vocabulary Alignment (TF-IDF Cosine Similarity): ${analysis.cosineSimilarity}%
Matching Skills Identified: ${matchingList}
Critical Missing Skills: ${missingList}
Extra Resume Skills: ${additionalList}

--- JOB DESCRIPTION ---
${jobDescription.slice(0, 3000)}

--- RESUME EXCERPT ---
${resumeText.slice(0, 3000)}

Please produce a comprehensive, structured evaluation report formatted in clean GitHub-Flavored Markdown:
1. ### 🎯 Executive Fit Summary
   - Provide an honest appraisal of the candidate's competitiveness for this specific role.
   - Mention key strengths and strong skill alignments.

2. ### ⚠️ Critical Skill Gaps & Impact
   - Explain why the missing skills are essential for this role.
   - Differentiate must-have requirements vs nice-to-have bonuses.

3. ### 🛠️ Fast-Track Action Plan to Bridge Gaps
   - Recommend 2-3 specific mini-projects or hands-on architectures the candidate can build to demonstrate the missing competencies.
   - Suggest targeted documentation or certifications.

4. ### 📄 ATS & Resume Positioning Advice
   - How should the candidate rephrase or highlight their existing experience to better pass ATS scans for this role?
   - Specific bullet-point phrasing improvements.

5. ### 🎤 Interview Preparation Focus
   - 3-4 likely technical questions or system design topics the interviewer will press them on based on the gaps identified.

Keep the advice direct, encouraging, and highly actionable.`;

    const aiResponse = await AI.chat.completions.create({
      model: 'gemini-3-flash-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000
    });

    const aiFeedback = aiResponse.choices?.[0]?.message?.content || 'Unable to generate AI recommendations at this moment.';

    // 4. Assemble Full Markdown Report for Dashboard Storage & Exports
    const formattedContent = `## 📊 Resume–Job Match Analysis Report

**Target Role:** ${jobTitle || 'Target Role'}  
**Overall Match Score:** **${analysis.overallScore}%** | **Technical Skill Match:** **${analysis.directSkillMatchPercent}%** | **Contextual Similarity:** **${analysis.cosineSimilarity}%**  

---

### 🎯 Matching Skills (${analysis.matchingSkills.length})
${analysis.matchingSkills.length > 0 ? analysis.matchingSkills.map(s => `\`${s}\``).join(' • ') : '_No exact skill matches identified._'}

### ⚠️ Missing Required Skills (${analysis.missingSkills.length})
${analysis.missingSkills.length > 0 ? analysis.missingSkills.map(s => `\`${s}\``).join(' • ') : '_Candidate satisfies all identified technical requirements!_'}

### ➕ Additional Resume Skills (${analysis.additionalSkills.length})
${analysis.additionalSkills.length > 0 ? analysis.additionalSkills.slice(0, 12).map(s => `\`${s}\``).join(' • ') : '_None_'}

---

${aiFeedback}
`;

    // 5. Clean up temporary uploaded PDF
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      filePath = null;
    }

    // 6. Save to database history
    const dbPrompt = `Match resume (${resume.originalname}) to ${jobTitle || 'Job Description'}`;
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${dbPrompt}, ${formattedContent}, 'resume-job-match')`;

    return res.json({
      success: true,
      analysis,
      aiFeedback,
      content: formattedContent
    });
  } catch (error) {
    console.error('Resume-Job Match Error:', error);
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.json({ success: false, message: error.message || 'An error occurred during analysis.' });
  }
};

/**
 * Feature 2: Intelligent Document & Research-Paper Analyzer
 * Deterministic NLP layer: stats, readability, keyword extraction, doc-type detection.
 * AI layer: structured breakdown tailored to document type (research paper vs. general doc).
 */
export const analyzeDocument = async (req, res) => {
  let filePath = req.file?.path || null;

  const cleanupFile = () => {
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (err) { console.error('File cleanup error:', err); }
      filePath = null;
    }
  };

  try {
    const { userId } = req.auth();
    const file = req.file;

    if (req.plan !== 'premium') {
      cleanupFile();
      return res.status(403).json({
        success: false,
        message: 'Document Analyzer is a premium feature. Upgrade your plan to continue.'
      });
    }

    if (!file) {
      cleanupFile();
      return res.json({ success: false, message: 'Please upload a PDF document to analyze.' });
    }

    if (file.size > 10 * 1024 * 1024) {
      cleanupFile();
      return res.json({ success: false, message: 'Document file size exceeds the 10MB limit.' });
    }

    // 1. Extract raw text
    const docText = await extractPdfText(filePath);

    if (!docText || docText.trim().length < 100) {
      cleanupFile();
      return res.json({
        success: false,
        message: 'Could not extract readable text from this PDF. Please ensure it is a text-based (not scanned) PDF.'
      });
    }

    // 2. Deterministic NLP Analysis
    const structure = detectDocumentStructure(docText);
    const stats = calculateBasicStats(docText);
    const readability = calculateReadability(docText);
    const topKeywords = extractKeywords(docText, 12);

    // 3. Build AI prompt (branching on document type)
    const isResearchPaper = structure.isResearchPaper;
    const docType = structure.documentType;

    const nlpSummary = `
--- NLP COMPUTED METRICS ---
Document Type (heuristic): ${docType} (Confidence: ${structure.confidence}%)
Detected Structural Sections: ${structure.detectedSections.join(', ') || 'None detected'}
Word Count: ${stats.wordCount} | Sentence Count: ${stats.sentenceCount} | Paragraph Count: ${stats.paragraphCount}
Avg Sentence Length: ${stats.avgSentenceLength} words | Estimated Reading Time: ${stats.estimatedReadingTimeMinutes} min
Flesch Reading Ease: ${readability.fleschReadingEase} | Reading Level: ${readability.readingLevel}
Flesch-Kincaid Grade: ${readability.fleschKincaidGrade}
Readability Reliable: ${readability.isReliable ? 'Yes' : 'No'}${readability.reliabilityNote ? ` (${readability.reliabilityNote})` : ''}
Top Keywords: ${topKeywords.map(k => `"${k.keyword}" (${k.count}x)`).join(', ')}
`;

    let prompt;
    if (isResearchPaper) {
      prompt = `You are a Senior AI Research Scientist and academic paper reviewer.
Analyze the research paper below using the computed NLP data provided.

${nlpSummary}

--- DOCUMENT TEXT (first 5000 characters) ---
${docText.slice(0, 5000)}

Produce a detailed, structured analysis in clean GitHub-Flavored Markdown:

### 📋 Paper Overview
- One-paragraph summary of the core research problem and contribution.

### 🔬 Methodology & Approach
- What methodology, algorithm, or system architecture was used?
- What datasets, benchmarks, or experimental setups were involved?

### 📊 Key Findings & Results
- What were the main numerical results or performance metrics?
- What conclusions did the authors draw?

### ⚠️ Limitations & Assumptions
- Identify the paper's acknowledged or implicit limitations.
- Note any assumptions or threats to validity.

### 🚀 Future Scope & Impact
- What future research directions are suggested?
- What is the practical or theoretical impact of this work?

### 🏷️ Classification Tags
- List 5–8 concise domain tags for this paper (e.g., Computer Vision, Transformer, Self-Supervised Learning).

Be precise, technical, and objective.`;
    } else {
      prompt = `You are a Senior Business Analyst and expert document reviewer.
Analyze the document below using the computed NLP data provided.

${nlpSummary}

--- DOCUMENT TEXT (first 5000 characters) ---
${docText.slice(0, 5000)}

Produce a clear, structured analysis in clean GitHub-Flavored Markdown:

### 📋 Executive Summary
- 2–3 sentence summary capturing the core purpose and main message of the document.

### 🗝️ Key Topics & Themes
- What are the main subjects, arguments, or areas covered?
- List as a concise, bulleted breakdown.

### 📑 Structural Breakdown
- Describe the document's logical structure and how the sections or ideas connect.
- Note any sections that seem incomplete, redundant, or unclear.

### ✅ Action Items & Recommendations
- Identify any explicit or implicit action items, decisions needed, or next steps.
- If none, note what follow-up actions would strengthen the document.

### 💡 Content Quality Observations
- Comment on writing clarity, tone, and audience appropriateness based on the readability metrics.
- Suggest one concrete improvement to the document's effectiveness.

Be concise, constructive, and professional.`;
    }

    const aiResponse = await AI.chat.completions.create({
      model: 'gemini-3-flash-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 3500
    });

    const aiFeedback = aiResponse.choices?.[0]?.message?.content || 'Unable to generate AI analysis at this time.';

    // 4. Assemble full report for storage
    const formattedContent = `## 📄 Document Analysis Report

**File:** ${file.originalname}  
**Document Type:** **${docType}** (${structure.confidence}% confidence)  
**Detected Sections:** ${structure.detectedSections.join(' • ') || 'N/A'}  

---

### 📊 Statistical Overview
| Metric | Value |
|--------|-------|
| Word Count | ${stats.wordCount.toLocaleString()} |
| Sentence Count | ${stats.sentenceCount.toLocaleString()} |
| Paragraph Count | ${stats.paragraphCount.toLocaleString()} |
| Avg Sentence Length | ${stats.avgSentenceLength} words |
| Reading Time | ~${stats.estimatedReadingTimeMinutes} min |
| Flesch Reading Ease | ${readability.fleschReadingEase} |
| Reading Level | ${readability.readingLevel} |
| FK Grade Level | ${readability.fleschKincaidGrade} |
| Readability Reliability | ${readability.isReliable ? 'Reliable (Standard Prose)' : `Caution: Unreliable (${readability.reliabilityNote || 'Non-prose structure'})`} |

### 🏷️ Top Keywords
${topKeywords.map(k => `\`${k.keyword}\` (${k.count}×, ${k.densityPercent}%)`).join(' • ')}

---

${aiFeedback}
`;

    // 5. Clean up temp file
    cleanupFile();

    // 6. Save to database
    const dbPrompt = `Analyze document: ${file.originalname}`;
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${dbPrompt}, ${formattedContent}, 'document-analysis')`;

    return res.json({
      success: true,
      structure,
      stats,
      readability,
      topKeywords,
      aiFeedback,
      content: formattedContent
    });

  } catch (error) {
    console.error('Document Analyzer Error:', error);
    cleanupFile();
    return res.json({ success: false, message: error.message || 'An error occurred during document analysis.' });
  }
};

/**
 * Feature 3: AI Content & SEO Analyzer
 * Combines deterministic NLP (readability, lexical diversity, passive voice ratio, heading hierarchy, keyword density)
 * with generative AI for editorial suggestions, meta description generation, and search-intent alignment.
 */
export const analyzeContentSeo = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, focusKeyword = '', title = '' } = req.body;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.status(403).json({
        success: false,
        message: 'AI Content & SEO Analyzer is a premium feature. Upgrade your plan to continue.'
      });
    }

    if (!content || typeof content !== 'string' || content.trim().length < 30) {
      return res.json({
        success: false,
        message: 'Please provide sufficient text content to analyze (at least 30 characters).'
      });
    }

    // Free tier credit deduction if not premium
    if (plan !== 'premium') {
      const creations = await sql`SELECT count(*) FROM creations WHERE user_id = ${userId}`;
      if (creations[0].count >= 10) {
        return res.json({
          success: false,
          message: 'You have exhausted your free credits. Upgrade to Premium for unlimited AI content and SEO audits.'
        });
      }
    }

    // 1. Run deterministic NLP & SEO metrics
    const metrics = calculateContentAndSeoMetrics(content, focusKeyword);

    // 2. Build AI Enhancement Prompt
    const prompt = `You are a World-Class SEO Strategist, Chief Content Officer, and Senior Copy Editor.
Evaluate the content below using the calculated NLP metrics provided.

--- COMPUTED NLP & SEO METRICS ---
Word Count: ${metrics.stats.wordCount} | Sentence Count: ${metrics.stats.sentenceCount} | Avg Sentence Length: ${metrics.stats.avgSentenceLength} words
Estimated Reading Time: ${metrics.stats.estimatedReadingTimeMinutes} minutes
Flesch Reading Ease: ${metrics.readability.fleschReadingEase} (${metrics.readability.readingLevel})
Flesch-Kincaid Grade: ${metrics.readability.fleschKincaidGrade}
Readability Reliable: ${metrics.readability.isReliable ? 'Yes' : 'No'}${metrics.readability.reliabilityNote ? ` (${metrics.readability.reliabilityNote})` : ''}
Lexical Diversity (Type-Token Ratio): ${metrics.lexicalDiversity}%
Passive Voice Instances: ${metrics.passiveVoice.count} (${metrics.passiveVoice.sentenceRatioPercent}% of sentences)
Headings Detected: H1: ${metrics.headings.h1Count}, H2: ${metrics.headings.h2Count}, H3: ${metrics.headings.h3Count} (Total: ${metrics.headings.total})
Focus Keyword: ${metrics.focusKeywordAnalysis.keyword || 'None specified'}
Focus Keyword Density: ${metrics.focusKeywordAnalysis.densityPercent}% (${metrics.focusKeywordAnalysis.status})
Content Quality Score: ${metrics.scores.contentQualityScore} / 100
SEO Health Score: ${metrics.scores.seoScore} / 100
Top Keywords Found: ${metrics.topKeywords.map(k => `"${k.keyword}" (${k.count}x)`).join(', ')}

--- ARTICLE CONTENT (first 5000 characters) ---
${content.slice(0, 5000)}

Deliver an actionable, high-impact editorial & SEO audit in clean GitHub-Flavored Markdown:

### 🎯 Strategic Executive Summary
- Brief 2-3 sentence overview of content strength, primary audience suitability, and search intent alignment.

### 🔍 Search Intent & SEO Optimization
- Evaluate keyword placement and discoverability.
- Recommended **Meta Title** (under 60 characters) and **Meta Description** (140–160 characters).
- Suggested related LSI / semantic keywords to incorporate naturally.

### ✍️ Readability & Editorial Refinements
- Concrete observations on sentence pacing, rhythm, and tone.
- Specific advice on passive-to-active voice conversions and clarity improvements.
- Structural heading hierarchy recommendations (H1, H2, H3 distribution).

### 🚀 Top 3 High-Impact Action Items
1. **[Quick Win]** Immediate tweak for instant readability/SEO boost.
2. **[Structural Upgrade]** Section or heading optimization.
3. **[Conversion/Engagement]** Hook or Call to Action (CTA) enhancement.

Be specific, encouraging, and authoritative.`;

    const aiResponse = await AI.chat.completions.create({
      model: 'gemini-3-flash-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 3500
    });

    const aiAudit = aiResponse.choices?.[0]?.message?.content || 'Unable to generate AI SEO audit at this time.';

    // 3. Format complete report for DB storage
    const formattedReport = `## 🚀 AI Content & SEO Audit Report

**Title/Topic:** ${title || focusKeyword || 'General Content'}  
**Focus Keyword:** ${focusKeyword || 'None specified'}  
**Content Quality Score:** **${metrics.scores.contentQualityScore}/100**  
**SEO Health Score:** **${metrics.scores.seoScore}/100**  

---

### 📊 Metric Breakdown
| Metric | Value | Status |
|---|---|---|
| Word Count | ${metrics.stats.wordCount.toLocaleString()} | ${metrics.stats.wordCount >= 600 ? 'Good' : 'Short'} |
| Readability | ${metrics.readability.fleschReadingEase} (${metrics.readability.readingLevel}) | ${metrics.readability.isReliable ? 'Reliable' : 'Unreliable / List'} |
| FK Grade Level | Grade ${metrics.readability.fleschKincaidGrade} | School Level |
| Lexical Diversity | ${metrics.lexicalDiversity}% | Vocabulary Richness |
| Passive Voice Ratio | ${metrics.passiveVoice.sentenceRatioPercent}% (${metrics.passiveVoice.count} instances) | ${metrics.passiveVoice.sentenceRatioPercent > 20 ? 'High' : 'Optimal'} |
| Heading Count | ${metrics.headings.total} (H1: ${metrics.headings.h1Count}, H2: ${metrics.headings.h2Count}, H3: ${metrics.headings.h3Count}) | Hierarchy |
| Keyword Density | ${metrics.focusKeywordAnalysis.densityPercent}% | ${metrics.focusKeywordAnalysis.status} |

---

${aiAudit}
`;

    // 4. Save to database
    const dbPrompt = `SEO Audit: ${title || focusKeyword || 'Content analysis'}`;
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${dbPrompt}, ${formattedReport}, 'content-seo-analysis')`;

    return res.json({
      success: true,
      metrics,
      aiAudit,
      content: formattedReport
    });

  } catch (error) {
    console.error('Content SEO Analyzer Error:', error);
    return res.json({
      success: false,
      message: error.message || 'An error occurred during content and SEO analysis.'
    });
  }
};

