/**
 * Rapid.ai 2.0 — Reusable NLP & Text Analysis Engine
 * 
 * Provides deterministic NLP, text preprocessing, statistical analysis,
 * TF-IDF vectorization, Cosine Similarity, skill extraction, readability scoring,
 * and SEO analysis.
 * 
 * Zero external dependencies: pure JavaScript (ES Module).
 */

// ==========================================
// 1. STOP WORDS DICTIONARY
// ==========================================
export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most',
  'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d',
  'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d',
  'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what',
  'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom',
  'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re',
  'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

// ==========================================
// 2. TECHNICAL SKILLS TAXONOMY
// ==========================================
export const TECHNICAL_SKILLS = {
  'Languages': [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'go', 'rust', 'ruby',
    'php', 'swift', 'kotlin', 'r', 'dart', 'scala', 'perl', 'matlab', 'bash', 'shell', 'sql',
    'html', 'css', 'sass', 'scss'
  ],
  'Frontend': [
    'react', 'react.js', 'next.js', 'vue', 'vue.js', 'nuxt.js', 'angular', 'svelte', 'sveltekit',
    'tailwind', 'tailwind css', 'bootstrap', 'material ui', 'mui', 'chakra ui', 'redux', 'redux toolkit',
    'zustand', 'recoil', 'mobx', 'webpack', 'vite', 'html5', 'css3', 'jquery', 'framer motion'
  ],
  'Backend': [
    'node.js', 'express', 'express.js', 'nestjs', 'fastify', 'django', 'flask', 'fastapi',
    'spring', 'spring boot', 'asp.net', '.net', 'ruby on rails', 'laravel', 'graphql', 'rest api',
    'restful api', 'grpc', 'websockets', 'microservices'
  ],
  'Databases & Storage': [
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server',
    'mariadb', 'cassandra', 'dynamodb', 'elasticsearch', 'supabase', 'firebase', 'neon', 'prisma',
    'sequelize', 'mongoose', 'typeorm'
  ],
  'Cloud, DevOps & Tools': [
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
    'ci/cd', 'github actions', 'jenkins', 'git', 'github', 'gitlab', 'linux', 'unix', 'nginx',
    'apache', 'terraform', 'ansible', 'vercel', 'netlify', 'render', 'cloudflare', 'postman'
  ],
  'AI, ML & Data Science': [
    'machine learning', 'deep learning', 'artificial intelligence', 'nlp', 'natural language processing',
    'computer vision', 'pytorch', 'tensorflow', 'keras', 'scikit-learn', 'pandas', 'numpy',
    'scipy', 'matplotlib', 'seaborn', 'opencv', 'llm', 'generative ai', 'gemini', 'openai',
    'langchain', 'hugging face', 'transformers', 'data analysis', 'data science'
  ],
  'Core CS & Methodologies': [
    'data structures', 'algorithms', 'system design', 'object-oriented programming', 'oop',
    'functional programming', 'design patterns', 'agile', 'scrum', 'kanban', 'unit testing',
    'tdd', 'test driven development', 'jest', 'cypress', 'selenium', 'git flow', 'clean code'
  ]
};

// Flattened lookup array sorted by length descending (to match "spring boot" before "spring")
const ALL_SKILLS_FLAT = Object.entries(TECHNICAL_SKILLS).flatMap(([category, skills]) =>
  skills.map(skill => ({
    name: skill,
    category,
    escapedRegex: skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }))
).sort((a, b) => b.name.length - a.name.length);

// ==========================================
// 3. TEXT PREPROCESSING & NORMALIZATION
// ==========================================

/**
 * Cleans text by normalizing whitespace, URLs, and noisy characters.
 */
export function cleanAndNormalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/https?:\/\/\S+/gi, ' ') // Remove URLs
    .replace(/[\r\n\t]+/g, ' ')       // Normalize newlines and tabs to space
    .replace(/[^\w\s.,!?:;\-–—/()]/g, ' ') // Keep safe punctuation
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .trim();
}

/**
 * Tokenizes text into lowercase word tokens, optionally filtering stop words.
 */
export function tokenizeWords(text, removeStopwords = false) {
  if (!text || typeof text !== 'string') return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^[-_]+|[-_]+$/g, ''))
    .filter(w => w.length > 1 && !/^\d+$/.test(w));

  if (removeStopwords) {
    return words.filter(w => !STOP_WORDS.has(w));
  }
  return words;
}

/**
 * Splits text into sentences.
 */
export function splitSentences(text) {
  if (!text || typeof text !== 'string') return [];
  // Standard sentence boundary with protection against e.g., i.e., etc.
  const cleaned = text.replace(/([A-Z]\.)\s+/g, '$1_PROTECTED_');
  return cleaned
    .split(/(?<=[.?!])\s+(?=[A-Z0-9])/g)
    .map(s => s.replace(/_PROTECTED_/g, ' ').trim())
    .filter(s => s.length > 0);
}

/**
 * Splits text into paragraphs.
 */
export function splitParagraphs(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

// ==========================================
// 4. BASIC TEXT STATISTICS
// ==========================================

/**
 * Computes fundamental text statistics.
 */
export function calculateBasicStats(text) {
  if (!text || typeof text !== 'string') {
    return {
      wordCount: 0,
      charCount: 0,
      charCountNoSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      avgSentenceLength: 0,
      avgWordLength: 0,
      estimatedReadingTimeMinutes: 0
    };
  }

  const words = tokenizeWords(text, false);
  const sentences = splitSentences(text);
  const paragraphs = splitParagraphs(text);

  const wordCount = words.length;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  const sentenceCount = Math.max(1, sentences.length);
  const paragraphCount = Math.max(1, paragraphs.length);

  const avgSentenceLength = wordCount > 0 ? parseFloat((wordCount / sentenceCount).toFixed(1)) : 0;
  const totalWordChars = words.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength = wordCount > 0 ? parseFloat((totalWordChars / wordCount).toFixed(1)) : 0;

  // Average human reading speed: ~200 words per minute
  const readingTime = parseFloat((wordCount / 200).toFixed(1));

  return {
    wordCount,
    charCount,
    charCountNoSpaces,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgSentenceLength,
    avgWordLength,
    estimatedReadingTimeMinutes: Math.max(0.1, readingTime)
  };
}

// ==========================================
// 5. READABILITY FORMULAS (FLESCH & GRADE)
// ==========================================

/**
 * Heuristic syllable counter for English words.
 */
export function countSyllables(word) {
  if (!word) return 0;
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length <= 3) return 1;

  const stripped = clean
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '');

  const matches = stripped.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Computes Flesch Reading Ease and Flesch-Kincaid Grade Level.
 */
export function calculateReadability(text) {
  const words = tokenizeWords(text, false);
  const sentences = splitSentences(text);

  if (words.length === 0 || sentences.length === 0) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
      readingLevel: 'N/A',
      syllableCount: 0,
      isReliable: false,
      reliabilityNote: 'No readable text or sentences provided.'
    };
  }

  const totalWords = words.length;
  const totalSentences = Math.max(1, sentences.length);
  const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0);

  const asl = totalWords / totalSentences; // Average Sentence Length
  const asw = totalSyllables / totalWords; // Average Syllables per Word

  // Flesch Reading Ease formula: 206.835 - (1.015 * ASL) - (84.6 * ASW)
  let fre = 206.835 - (1.015 * asl) - (84.6 * asw);
  fre = Math.max(0, Math.min(100, Math.round(fre * 10) / 10));

  // Flesch-Kincaid Grade Level formula: (0.39 * ASL) + (11.8 * ASW) - 15.59
  let fkg = (0.39 * asl) + (11.8 * asw) - 15.59;
  fkg = Math.max(1, Math.round(fkg * 10) / 10);

  let readingLevel = 'Standard';
  if (fre >= 90) readingLevel = 'Very Easy (5th grade)';
  else if (fre >= 80) readingLevel = 'Easy (6th grade)';
  else if (fre >= 70) readingLevel = 'Fairly Easy (7th grade)';
  else if (fre >= 60) readingLevel = 'Standard (8th-9th grade)';
  else if (fre >= 50) readingLevel = 'Fairly Difficult (10th-12th grade)';
  else if (fre >= 30) readingLevel = 'Difficult (College level)';
  else readingLevel = 'Very Difficult (Graduate level)';

  // Reliability Assessment:
  // Standard readability formulas assume continuous prose paragraphs.
  // Resumes, list-heavy documents, bullet points, and very short texts distort sentence length and syllable metrics.
  const isReliable = totalSentences >= 3 && asl <= 50;

  let reliabilityNote = null;
  if (!isReliable) {
    if (totalSentences < 3) {
      reliabilityNote = 'Sample too short (< 3 sentences) for statistically reliable readability scoring.';
    } else if (asl > 50) {
      reliabilityNote = 'High average sentence length (> 50 words/sentence) indicates list-heavy, unpunctuated, or resume-style structure; standard prose readability formulas may be inaccurate.';
    } else {
      reliabilityNote = 'Document structure may not be standard prose; readability metrics should be interpreted with caution.';
    }
    readingLevel = 'Unreliable (Non-Prose / List Structure)';
  }

  return {
    fleschReadingEase: fre,
    fleschKincaidGrade: fkg,
    readingLevel,
    syllableCount: totalSyllables,
    isReliable,
    reliabilityNote
  };
}

// ==========================================
// 6. KEYWORD EXTRACTION & FREQUENCY ANALYSIS
// ==========================================

/**
 * Extracts top keywords with counts and relative frequencies.
 */
export function extractKeywords(text, topN = 10) {
  const words = tokenizeWords(text, true);
  if (words.length === 0) return [];

  const freqMap = {};
  for (const word of words) {
    if (word.length >= 3) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }
  }

  const sorted = Object.entries(freqMap)
    .map(([keyword, count]) => ({
      keyword,
      count,
      densityPercent: parseFloat(((count / words.length) * 100).toFixed(2))
    }))
    .sort((a, b) => b.count - a.count);

  return sorted.slice(0, topN);
}

// ==========================================
// 7. TF-IDF VECTORIZATION & COSINE SIMILARITY
// ==========================================

/**
 * Calculates TF-IDF vectors for two documents and computes their Cosine Similarity.
 * Returns similarity score between 0 and 100%.
 */
export function calculateTFIDFAndCosineSimilarity(docA, docB) {
  const tokensA = tokenizeWords(docA, true);
  const tokensB = tokenizeWords(docB, true);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return { cosineSimilarity: 0, sharedTermsCount: 0, topSharedTerms: [] };
  }

  // Build vocabulary
  const vocabSet = new Set([...tokensA, ...tokensB]);
  const vocabulary = Array.from(vocabSet);
  const N = 2; // Two documents

  // Term frequencies
  const tfA = {};
  const tfB = {};
  for (const t of tokensA) tfA[t] = (tfA[t] || 0) + 1;
  for (const t of tokensB) tfB[t] = (tfB[t] || 0) + 1;

  // Document frequencies for IDF
  const idf = {};
  for (const term of vocabulary) {
    let df = 0;
    if (tfA[term]) df++;
    if (tfB[term]) df++;
    // Smoothed IDF: log((N + 1) / (df + 1)) + 1
    idf[term] = Math.log((N + 1) / (df + 1)) + 1;
  }

  // Vector representations
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const sharedTerms = [];

  for (const term of vocabulary) {
    const valA = ((tfA[term] || 0) / tokensA.length) * idf[term];
    const valB = ((tfB[term] || 0) / tokensB.length) * idf[term];

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;

    if ((tfA[term] || 0) > 0 && (tfB[term] || 0) > 0) {
      sharedTerms.push({
        term,
        score: parseFloat((valA * valB).toFixed(4)),
        countInA: tfA[term],
        countInB: tfB[term]
      });
    }
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  const cosineSimilarity = normA > 0 && normB > 0
    ? Math.min(100, Math.max(0, Math.round((dotProduct / (normA * normB)) * 1000) / 10))
    : 0;

  sharedTerms.sort((a, b) => b.score - a.score);

  return {
    cosineSimilarity,
    sharedTermsCount: sharedTerms.length,
    topSharedTerms: sharedTerms.slice(0, 10)
  };
}

// ==========================================
// 8. TECHNICAL SKILL EXTRACTION & MATCHING
// ==========================================

/**
 * Extracts technical skills from text using the taxonomy.
 */
export function extractSkills(text) {
  if (!text || typeof text !== 'string') {
    return { skills: [], categorized: {}, totalFound: 0 };
  }

  const normalizedText = ' ' + text.toLowerCase().replace(/[\r\n\t]+/g, ' ') + ' ';
  const matchedSet = new Set();
  const categorized = {};

  for (const category of Object.keys(TECHNICAL_SKILLS)) {
    categorized[category] = [];
  }

  for (const { name, category, escapedRegex } of ALL_SKILLS_FLAT) {
    // Exact word boundary matching or punctuation boundary
    const regex = new RegExp(`(?:^|[\\s,;.:/()\\[\\]\\-])(${escapedRegex})(?=[\\s,;.:/()\\[\\]\\-]|$)`, 'i');
    if (regex.test(normalizedText) && !matchedSet.has(name)) {
      matchedSet.add(name);
      categorized[category].push(name);
    }
  }

  // Clean empty categories
  for (const cat of Object.keys(categorized)) {
    if (categorized[cat].length === 0) delete categorized[cat];
  }

  const skillsList = Array.from(matchedSet);

  return {
    skills: skillsList,
    categorized,
    totalFound: skillsList.length
  };
}

/**
 * Transparent Skill-Gap Matching Engine comparing Resume to Job Description.
 */
export function matchSkills(resumeText, jobDescriptionText) {
  const resumeExtracted = extractSkills(resumeText);
  const jdExtracted = extractSkills(jobDescriptionText);

  const resumeSkillsSet = new Set(resumeExtracted.skills);
  const jdSkillsSet = new Set(jdExtracted.skills);

  const matchingSkills = [];
  const missingSkills = [];
  const additionalSkills = [];

  for (const skill of jdSkillsSet) {
    if (resumeSkillsSet.has(skill)) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  for (const skill of resumeSkillsSet) {
    if (!jdSkillsSet.has(skill)) {
      additionalSkills.push(skill);
    }
  }

  // Direct Skill Match %: |Matching| / |Required|
  const directSkillMatchPercent = jdSkillsSet.size > 0
    ? Math.min(100, Math.round((matchingSkills.length / jdSkillsSet.size) * 100))
    : (matchingSkills.length > 0 ? 100 : 0);

  // TF-IDF Cosine Similarity for broader contextual matching
  const { cosineSimilarity, topSharedTerms } = calculateTFIDFAndCosineSimilarity(resumeText, jobDescriptionText);

  // Transparent Weighted Match Score: 70% Skill Match + 30% Contextual Cosine Similarity
  const overallScore = Math.min(100, Math.round((directSkillMatchPercent * 0.7) + (cosineSimilarity * 0.3)));

  // Categorize matched vs missing
  const matchedByCategory = {};
  const missingByCategory = {};

  for (const [cat, skills] of Object.entries(jdExtracted.categorized)) {
    for (const skill of skills) {
      if (resumeSkillsSet.has(skill)) {
        if (!matchedByCategory[cat]) matchedByCategory[cat] = [];
        matchedByCategory[cat].push(skill);
      } else {
        if (!missingByCategory[cat]) missingByCategory[cat] = [];
        missingByCategory[cat].push(skill);
      }
    }
  }

  return {
    overallScore,
    directSkillMatchPercent,
    cosineSimilarity,
    matchingSkills,
    missingSkills,
    additionalSkills,
    matchedByCategory,
    missingByCategory,
    topSharedTerms,
    stats: {
      totalRequiredSkills: jdSkillsSet.size,
      totalResumeSkills: resumeSkillsSet.size,
      matchedCount: matchingSkills.length,
      missingCount: missingSkills.length,
      additionalCount: additionalSkills.length
    },
    scoringFormula: 'Overall Score = (70% × Direct Skill Match) + (30% × Contextual TF-IDF Cosine Similarity)'
  };
}

// ==========================================
// 9. DOCUMENT STRUCTURE & RESEARCH PAPER DETECTOR
// ==========================================

/**
 * Heuristically detects document structure and determines if it is a Research Paper.
 */
export function detectDocumentStructure(text) {
  if (!text || typeof text !== 'string') {
    return {
      isResearchPaper: false,
      confidence: 0,
      detectedSections: [],
      paperSpecificMarkers: [],
      documentType: 'General Document'
    };
  }

  // Research paper section markers that should appear as section headings
  // Headings can be prefixed with optional numbering (e.g., "1. Introduction", "Section IV: Results")
  const headingMarkers = [
    {
      key: 'abstract',
      label: 'Abstract',
      headingRegex: /^(?:(?:section\s+)?(?:\d+|[ivx]+)[.:\s-]*)?abstract(?:\s*[:.-]*)?$/i,
      weight: 25
    },
    {
      key: 'introduction',
      label: 'Introduction',
      headingRegex: /^(?:(?:section\s+)?(?:\d+|[ivx]+)[.:\s-]*)?introduction(?:\s*[:.-]*)?$/i,
      weight: 15
    },
    {
      key: 'related_work',
      label: 'Related Work / Literature Review',
      headingRegex: /^(?:(?:section\s+)?(?:\d+|[ivx]+)[.:\s-]*)?(?:related\s+work|literature\s+review|prior\s+work|background(?:\s+and\s+related\s+work)?)(?:\s*[:.-]*)?$/i,
      weight: 15
    },
    {
      key: 'methodology',
      label: 'Methodology / Proposed Method',
      headingRegex: /^(?:(?:section\s+)?(?:\d+|[ivx]+)[.:\s-]*)?(?:methodology|methods|materials\s+and\s+methods|proposed\s+(?:method|system|framework|approach|model|architecture)|system\s+(?:design|architecture|model))(?:\s*[:.-]*)?$/i,
      weight: 20
    },
    {
      key: 'experiments',
      label: 'Experiments / Evaluation / Results',
      headingRegex: /^(?:(?:section\s+)?(?:\d+|[ivx]+)[.:\s-]*)?(?:experiments?(?:\s+and\s+results)?|experimental\s+(?:setup|results|evaluation)|results(?:\s+and\s+discussion)?|evaluation)(?:\s*[:.-]*)?$/i,
      weight: 20
    },
    {
      key: 'conclusion',
      label: 'Conclusion / Future Work',
      headingRegex: /^(?:(?:section\s+)?(?:\d+|[ivx]+)[.:\s-]*)?(?:conclusions?|concluding\s+remarks|future\s+(?:work|scope)|conclusions?\s+and\s+future\s+work)(?:\s*[:.-]*)?$/i,
      weight: 15
    },
    {
      key: 'references',
      label: 'References / Bibliography',
      headingRegex: /^(?:(?:section\s+)?(?:\d+|[ivx]+)[.:\s-]*)?(?:references|bibliography|works\s+cited)(?:\s*[:.-]*)?$/i,
      weight: 20
    }
  ];

  // Global document-level marker for Academic / Publication identifiers (DOIs, arXiv, publisher marks)
  // These can appear anywhere (headers, footers, metadata)
  const academicIdMarker = {
    key: 'academic_id',
    label: 'Academic ID (DOI / arXiv / ISSN)',
    regex: /\b(?:doi:\s*10\.\d{4,9}\/[-._;()/:a-z0-9]+|10\.\d{4,9}\/[-._;()/:a-z0-9]+|arxiv:\s*\d{4}\.\d{4,5}(?:v\d+)?|issn\s*[:\d-]{8,}|ieee\s+transactions|acm\s+transactions|elsevier|springer\s+nature)\b/i,
    weight: 25
  };

  const detectedSections = [];
  const paperSpecificMarkers = [];
  let totalScore = 0;
  const matchedMarkerKeys = new Set();

  // 1. Line-by-line heading detection
  // Split into lines to evaluate headings cleanly
  const rawLines = text.split(/\r?\n/);

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // First check if this line is a recognized research paper heading
    // (e.g. "1. Introduction", "3. Methodology", "Section 2: Related Work")
    let isHeadingMatch = false;
    for (const marker of headingMarkers) {
      if (!matchedMarkerKeys.has(marker.key) && marker.headingRegex.test(trimmed)) {
        matchedMarkerKeys.add(marker.key);
        detectedSections.push(marker.label);
        paperSpecificMarkers.push(marker.key);
        totalScore += marker.weight;
        isHeadingMatch = true;
        break;
      }
    }
    if (isHeadingMatch) continue;

    // Exclude lines beginning with bullet symbols or numbered-list items:
    // e.g., •, -, *, +, ➢, ✔, 1., 1), a., etc.
    const isBulletOrListItem = /^(?:[•\u2022\u2023\u25E6\u2043\u2219\-*+➢✔]|(?:\(?\d+[.)\]]|\(?[a-zA-Z][.)\]]))\s+/.test(trimmed);
    if (isBulletOrListItem) {
      continue;
    }

    // Maximum heading length rule: maximum 12 words
    const wordsInLine = trimmed.split(/\s+/).filter(Boolean);
    if (wordsInLine.length > 12) {
      continue;
    }

    // Check against each heading marker
    for (const marker of headingMarkers) {
      if (!matchedMarkerKeys.has(marker.key)) {
        if (marker.headingRegex.test(trimmed)) {
          matchedMarkerKeys.add(marker.key);
          detectedSections.push(marker.label);
          paperSpecificMarkers.push(marker.key);
          totalScore += marker.weight;
        }
      }
    }
  }

  // 2. Academic ID detection anywhere in the document
  if (!matchedMarkerKeys.has(academicIdMarker.key) && academicIdMarker.regex.test(text)) {
    matchedMarkerKeys.add(academicIdMarker.key);
    detectedSections.push(academicIdMarker.label);
    paperSpecificMarkers.push(academicIdMarker.key);
    totalScore += academicIdMarker.weight;
  }

  // If score >= 60, it strongly qualifies as a research paper
  const isResearchPaper = totalScore >= 60;
  const confidence = Math.min(100, Math.round((totalScore / 130) * 100));

  return {
    isResearchPaper,
    confidence,
    detectedSections,
    paperSpecificMarkers,
    documentType: isResearchPaper ? 'Research Paper' : 'General Document'
  };
}

// ==========================================
// 10. CONTENT & SEO METRICS ANALYZER
// ==========================================

/**
 * Deterministic Content Quality & SEO Metrics Evaluator.
 */
export function calculateContentAndSeoMetrics(text, focusKeyword = '') {
  const stats = calculateBasicStats(text);
  const readability = calculateReadability(text);
  const topKeywords = extractKeywords(text, 15);

  const words = tokenizeWords(text, false);
  const uniqueWords = new Set(words);
  // Type-Token Ratio (Lexical Diversity): unique words / total words
  const lexicalDiversity = words.length > 0
    ? parseFloat(((uniqueWords.size / words.length) * 100).toFixed(1))
    : 0;

  // Passive voice detection heuristic (e.g. "is done", "was created", "been developed")
  const passiveRegex = /\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|[a-z]+en|done|seen|made|found|built|written|kept|chosen)\b/gi;
  const passiveMatches = text.match(passiveRegex) || [];
  const passiveSentenceRatio = stats.sentenceCount > 0
    ? Math.min(100, Math.round((passiveMatches.length / stats.sentenceCount) * 100))
    : 0;

  // Heading structure detection
  const h1Matches = text.match(/^#\s+[^\n]+/gm) || [];
  const h2Matches = text.match(/^##\s+[^\n]+/gm) || [];
  const h3Matches = text.match(/^###\s+[^\n]+/gm) || [];
  const totalHeadings = h1Matches.length + h2Matches.length + h3Matches.length;

  // Focus keyword analysis
  let focusKeywordDensity = 0;
  let focusKeywordCount = 0;
  let focusKeywordStatus = 'Not specified';

  if (focusKeyword && focusKeyword.trim().length > 0) {
    const cleanKw = focusKeyword.trim().toLowerCase();
    const kwRegex = new RegExp(`\\b${cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(kwRegex);
    focusKeywordCount = matches ? matches.length : 0;
    focusKeywordDensity = words.length > 0
      ? parseFloat(((focusKeywordCount / words.length) * 100).toFixed(2))
      : 0;

    if (focusKeywordDensity >= 1.0 && focusKeywordDensity <= 2.5) {
      focusKeywordStatus = 'Optimal (1.0% – 2.5%)';
    } else if (focusKeywordDensity > 2.5) {
      focusKeywordStatus = 'Over-optimized (> 2.5%, risk of keyword stuffing)';
    } else {
      focusKeywordStatus = 'Under-optimized (< 1.0%)';
    }
  }

  // Deterministic Content Quality Score (0 - 100)
  // Rubric: Word count depth (25), Readability (25), Lexical diversity (25), Sentence structure (25)
  let contentScore = 0;
  // Word count score (target 500-1500 words for quality article)
  if (stats.wordCount >= 500) contentScore += 25;
  else if (stats.wordCount >= 300) contentScore += 18;
  else if (stats.wordCount >= 150) contentScore += 12;
  else contentScore += 5;

  // Readability score
  if (readability.fleschReadingEase >= 55 && readability.fleschReadingEase <= 80) contentScore += 25;
  else if (readability.fleschReadingEase >= 40) contentScore += 20;
  else contentScore += 12;

  // Lexical Diversity score
  if (lexicalDiversity >= 45) contentScore += 25;
  else if (lexicalDiversity >= 35) contentScore += 20;
  else contentScore += 10;

  // Sentence structure (ideal average length: 12-20 words/sentence)
  if (stats.avgSentenceLength >= 10 && stats.avgSentenceLength <= 22) contentScore += 25;
  else if (stats.avgSentenceLength <= 28) contentScore += 18;
  else contentScore += 10;

  // Deterministic SEO Score (0 - 100)
  // Rubric: Heading hierarchy (25), Content length (25), Focus keyword or keyword variety (25), Readability ease (25)
  let seoScore = 0;
  if (totalHeadings >= 3) seoScore += 25;
  else if (totalHeadings >= 1) seoScore += 18;
  else seoScore += 5;

  if (stats.wordCount >= 600) seoScore += 25;
  else if (stats.wordCount >= 300) seoScore += 18;
  else seoScore += 10;

  if (focusKeyword) {
    if (focusKeywordDensity >= 1.0 && focusKeywordDensity <= 2.5) seoScore += 25;
    else if (focusKeywordDensity > 0) seoScore += 15;
    else seoScore += 5;
  } else {
    // If no keyword, evaluate top keyword presence
    if (topKeywords.length >= 5) seoScore += 20;
    else seoScore += 10;
  }

  if (readability.fleschReadingEase >= 50) seoScore += 25;
  else if (readability.fleschReadingEase >= 30) seoScore += 15;
  else seoScore += 8;

  return {
    stats,
    readability,
    lexicalDiversity,
    passiveVoice: {
      count: passiveMatches.length,
      sentenceRatioPercent: passiveSentenceRatio,
      examples: Array.from(new Set(passiveMatches)).slice(0, 5)
    },
    headings: {
      total: totalHeadings,
      h1Count: h1Matches.length,
      h2Count: h2Matches.length,
      h3Count: h3Matches.length
    },
    focusKeywordAnalysis: {
      keyword: focusKeyword,
      count: focusKeywordCount,
      densityPercent: focusKeywordDensity,
      status: focusKeywordStatus
    },
    topKeywords,
    scores: {
      contentQualityScore: Math.min(100, Math.max(0, contentScore)),
      seoScore: Math.min(100, Math.max(0, seoScore))
    }
  };
}
