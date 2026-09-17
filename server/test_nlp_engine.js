import {
  cleanAndNormalizeText,
  tokenizeWords,
  splitSentences,
  splitParagraphs,
  calculateBasicStats,
  countSyllables,
  calculateReadability,
  extractKeywords,
  calculateTFIDFAndCosineSimilarity,
  extractSkills,
  matchSkills,
  detectDocumentStructure,
  calculateContentAndSeoMetrics
} from './utils/nlpEngine.js';

console.log('=== RAPID.AI 2.0 NLP ENGINE UNIT TESTS ===\n');

// 1. Text Preprocessing
const rawText = "   Hello world! Check https://example.com/test.   We are building Rapid.ai 2.0 with Node.js & React!   ";
const cleaned = cleanAndNormalizeText(rawText);
console.log('1. cleanAndNormalizeText:', cleaned);

// 2. Tokenization
const tokens = tokenizeWords("React is awesome, but TypeScript and Node.js are powerful.", true);
console.log('2. tokenizeWords (filtered stop words):', tokens);

// 3. Stats & Readability
const sampleText = `Artificial intelligence is transforming software engineering. Developers write code faster using modern tools.
By analyzing requirements carefully, developers can produce high-quality systems that scale reliably.`;
const stats = calculateBasicStats(sampleText);
console.log('3. calculateBasicStats:', stats);

const readability = calculateReadability(sampleText);
console.log('4. calculateReadability:', readability);

// 4. Skills extraction
const sampleResume = `
Experienced Full Stack Developer with 4 years of experience building scalable web applications.
Proficient in JavaScript, TypeScript, React, Next.js, Tailwind CSS, Node.js, Express, and PostgreSQL.
Hands-on experience with Docker, AWS, Git, and REST APIs. Built machine learning pipelines using Python and Scikit-learn.
`;

const sampleJobDescription = `
We are seeking a Senior Full Stack Engineer.
Required Skills:
- Strong proficiency in React, TypeScript, Node.js, Express, PostgreSQL, and Docker.
- Experience with Kubernetes, GraphQL, and Redis is a plus.
- Solid understanding of Data Structures, Algorithms, and System Design.
`;

const resumeSkills = extractSkills(sampleResume);
console.log('5. extractSkills (Resume):', resumeSkills.skills);

const matchResult = matchSkills(sampleResume, sampleJobDescription);
console.log('6. matchSkills Result:');
console.log('   Overall Score:', matchResult.overallScore, '%');
console.log('   Direct Skill Match:', matchResult.directSkillMatchPercent, '%');
console.log('   TF-IDF Cosine Similarity:', matchResult.cosineSimilarity, '%');
console.log('   Matching Skills:', matchResult.matchingSkills);
console.log('   Missing Skills:', matchResult.missingSkills);
console.log('   Additional Skills:', matchResult.additionalSkills);

// 5. Document Structure Detection
const sampleResearchPaper = `
Abstract
This paper presents a novel approach to natural language processing using transformer architectures.
1. Introduction
Deep learning has achieved remarkable results in recent years.
2. Methodology
We propose a lightweight multi-head attention mechanism.
3. Experiments and Results
Our evaluation shows a 15% increase in efficiency.
4. Conclusion
We demonstrated effective text extraction without heavy dependencies.
References
[1] Vaswani et al., Attention is All You Need, 2017.
DOI: 10.1145/1234567.8910
`;

const docDetection = detectDocumentStructure(sampleResearchPaper);
console.log('7. detectDocumentStructure (Research Paper):', docDetection);

// 6. Content & SEO Analysis
const sampleArticle = `
# Building Scalable Web Applications with React and Node.js

## Introduction to Modern Web Architecture
Building web applications in 2026 requires careful consideration of performance, scalability, and developer experience. React and Node.js have become the industry standard for full-stack JavaScript development.

## Core Best Practices for React Applications
When developing frontend applications with React, state management and component reusability are paramount. Utilizing modern hooks and lightweight state libraries ensures clean code.

## Optimizing Backend APIs with Node.js
On the server side, Node.js provides an asynchronous event-driven runtime that excels at handling concurrent I/O operations. Pair Node.js with PostgreSQL for relational integrity.
`;

const seoMetrics = calculateContentAndSeoMetrics(sampleArticle, 'React and Node.js');
console.log('8. calculateContentAndSeoMetrics:');
console.log('   Content Quality Score:', seoMetrics.scores.contentQualityScore);
console.log('   SEO Score:', seoMetrics.scores.seoScore);
console.log('   Focus Keyword Density:', seoMetrics.focusKeywordAnalysis.densityPercent, '% (Status:', seoMetrics.focusKeywordAnalysis.status, ')');
console.log('   Lexical Diversity:', seoMetrics.lexicalDiversity, '%');

console.log('\n=== ALL NLP ENGINE TESTS COMPLETED SUCCESSFULLY ===');
