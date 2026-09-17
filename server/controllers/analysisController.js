import OpenAI from 'openai';
import sql from '../configs/db.js';
import fs from 'fs';
import { extractPdfText } from '../utils/pdfHelper.js';
import { matchSkills } from '../utils/nlpEngine.js';

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
