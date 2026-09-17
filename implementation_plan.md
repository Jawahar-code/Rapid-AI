# Rapid.ai 2.0 — Architecture Audit & Implementation Plan

Upgrade of Rapid.ai to Rapid.ai 2.0 on branch `rapid.ai-v2`, adding transparent NLP text analysis, resume–job matching, research paper document analysis, and AI SEO content optimization while strictly preserving existing features.

---

## 1. Project Audit Summary

### 1.1 Current Git Environment
- **Branch**: `rapid.ai-v2` (Verified active and tracking `origin/rapid.ai-v2`)
- **Status**: Clean working tree; no uncommitted changes
- **Deployment**: Original deployment remains on `main` branch; 2.0 will deploy as a separate Vercel project (`rapid-ai-v2`)

### 1.2 Existing Architecture Overview
- **Client**: React 19 + Vite 8 + Tailwind CSS v4 + React Router v7 + Framer Motion + Lucide React + Clerk React + Recharts + React Markdown + React Hot Toast.
- **Server**: Node.js (ES Modules) + Express 5 + Neon PostgreSQL (`@neondatabase/serverless`) + Clerk Express (`@clerk/express`) + Multer + Google Gemini (`gemini-3-flash-preview` via `openai` SDK) + Cloudinary + `pdf-parse`.
- **Database**: Single table `creations` in Neon PostgreSQL (`id`, `user_id`, `prompt`, `content`, `type`, `publish`, `likes`, `created_at`, `update_at`).
- **Auth & Credits**: Clerk JWT auth (`auth` middleware). 10 free credits for free users; Premium plan unlocks unlimited usage and gated tools.

---

## 2. Reusable Files vs. New Files

### Existing Files to Reuse Without Breaking Changes
- `server/configs/db.js` — SQL database queries
- `server/configs/multer.js` — Multipart PDF file uploads
- `server/middlewares/auth.js` — Clerk authentication & plan checks
- `client/src/components/Protect.jsx` — Plan-based feature protection
- `client/src/pages/Layout.jsx` — Studio shell layout with sidebar and navbar
- `client/src/components/ThemeToggle.jsx` — Light/Dark mode state
- `client/src/components/CreationItem.jsx` — Creation history viewer in Dashboard

### Minimal Non-Breaking Modifications to Existing Files
- `client/src/App.jsx` — Register 3 new routes (`/ai/resume-job-match`, `/ai/document-analyzer`, `/ai/seo-analyzer`)
- `client/src/components/Sidebar.jsx` — Add navigation links under a new "NLP & Intelligence Suite" dropdown or section
- `client/src/assets/assets.js` — Add tool cards metadata for the new 2.0 tools
- `client/src/pages/WriteArticle.jsx` — Add an "Analyze with SEO Analyzer" quick-action button to pass generated articles to the analyzer
- `server/routes/aiRoutes.js` — Mount 3 new API endpoints
- `server/controllers/aiController.js` — Import and call the new controller handlers

### Proposed New Files
1. **`server/utils/nlpEngine.js`**: Core reusable NLP intelligence engine (text preprocessing, tokenization, n-grams, stop words removal, TF-IDF calculation, cosine similarity, comprehensive tech skills taxonomy, readability metrics, SEO analyzer, research paper heuristic detector).
2. **`server/controllers/analysisController.js`**: Clean backend controller handling the 3 new endpoints:
   - `POST /api/ai/resume-job-match` (Multer resume upload + job description text)
   - `POST /api/ai/analyze-document` (Multer PDF upload)
   - `POST /api/ai/analyze-content-seo` (Raw text or article content)
3. **`client/src/pages/ResumeJobMatch.jsx`**: Frontend UI for Feature 1 (PDF upload, JD input, transparent score rings, matched/missing skill badges, AI gap advice).
4. **`client/src/pages/DocumentAnalyzer.jsx`**: Frontend UI for Feature 2 (PDF upload, auto doc vs research paper mode, metrics grid, structure tabs, structured findings).
5. **`client/src/pages/ContentSeoAnalyzer.jsx`**: Frontend UI for Feature 3 (text area / imported article, SEO metrics, readability meters, keyword density table, recommendations).

---

## 3. Detailed Feature Specifications

### Feature 1: Resume–Job Matching and Skill-Gap Analysis
- **Deterministic NLP Layer**:
  - Text cleaning (lowercase, strip non-alphanumeric noise, normalize whitespace, stop-word removal).
  - Skill taxonomy extraction: Comprehensive catalog of 200+ technical skills categorized into Languages, Frameworks/Libraries, Cloud/DevOps, Databases, AI/ML, and Core CS Concepts.
  - Set-based matching: Matched skills ($S_{match} = S_{resume} \cap S_{jd}$), Missing skills ($S_{missing} = S_{jd} \setminus S_{resume}$), Extra skills ($S_{extra} = S_{resume} \setminus S_{jd}$).
  - TF-IDF Vectorization & Cosine Similarity: Evaluates full contextual alignment between resume text and job description.
  - Transparent Overall Match Score:
    $$\text{Score} = (0.7 \times \text{Skill Match \%}) + (0.3 \times \text{Cosine Similarity \%})$$
- **AI Enhancement Layer**:
  - Gemini generates structured actionable recommendations: High-priority gaps, recommended projects/certifications, resume wording tweaks for ATS.

### Feature 2: Intelligent Document & Research-Paper Analyzer
- **Deterministic NLP Layer**:
  - Statistical summary: Word count, sentence count, paragraph count, character count, avg sentence length, estimated reading time ($W / 200\text{ wpm}$).
  - Readability formulas: Flesch Reading Ease ($206.835 - 1.015 \times \text{ASL} - 84.6 \times \text{ASW}$) and Flesch-Kincaid Grade Level.
  - Top Keywords: TF-IDF & frequency-based keyword ranking.
  - Document Classification Heuristic: Detects research papers vs. general documents via markers (Abstract, Methodology, Datasets, Results, References, DOI/arXiv).
- **AI Structured Layer**:
  - If research paper: Extracts Abstract, Methodology, Datasets & Algorithms, Key Findings, Limitations, Future Scope.
  - If general document: Extracts Executive Summary, Key Topics, Structural Breakdown, Action Items.

### Feature 3: AI Content and SEO Analyzer
- **Deterministic NLP Layer**:
  - Text statistics (words, sentences, paragraphs, avg sentence length, reading time).
  - Readability indices (Flesch Reading Ease & Grade Level).
  - Vocabulary richness: Type-Token Ratio (TTR / Lexical Diversity).
  - Heuristic Passive Voice detector (auxiliary verbs + past participles).
  - SEO Analysis: Keyword density analysis (identifying over-optimized vs optimal 1–2.5% density), heading hierarchy analysis (H1/H2/H3 counts), title/intro relevance.
  - Transparent Content Quality Score & SEO Score (calculated via documented weighted rubric).
- **AI Enhancement Layer**:
  - Gemini provides actionable content polish suggestions, meta description generation, and search intent alignment.

---

## 4. Database & Credit System Compatibility
- **Database**: Zero migrations required. Results will be saved to `creations` table using new types:
  - `'resume-job-match'`
  - `'document-analysis'`
  - `'content-seo-analysis'`
- **Credits**: Works transparently with existing credit model (`req.plan === 'premium'` or deduction from free credits).

---

## 5. Verification Plan

### Automated & Unit Verification
- Test `nlpEngine.js` with standalone test vectors (tokenization, TF-IDF calculation, cosine similarity, skill extraction, Flesch scores).
- Test PDF text extraction with sample documents.

### Manual End-to-End Verification
- Feature 1: Upload test resume PDF, paste sample Software Engineer JD, verify match score calculation, skill badges, and Gemini advice.
- Feature 2: Upload general document and research paper PDF; verify statistical counters, document type detection, and structured breakdown.
- Feature 3: Paste article; verify word count, reading ease, SEO score, keyword density, and AI suggestions.
- Regression Testing: Verify all original 7 tools (Article Writer, Blog Titles, Image Gen, Background Removal, Object Eraser, PDF Summarizer, Resume Reviewer) continue to operate normally.

---

## 6. One-Day MVP Scope (Prioritized)

| Priority | Feature / Component | Status |
|----------|---------------------|--------|
| **P0** | Stage 0: Audit & Safety Verification | Completed |
| **P0** | Stage 1: Reusable NLP Engine (`server/utils/nlpEngine.js`) | Next |
| **P0** | Stage 2: Resume–Job Matching (Backend & Frontend MVP) | Planned |
| **P0** | Stage 3: Intelligent Document Analyzer (Backend & Frontend MVP) | Planned |
| **P0** | Stage 4: AI Content & SEO Analyzer (Backend & Frontend MVP) | Planned |
| **P0** | Stage 5: End-to-End Testing & Vercel 2.0 Deployment Config | Planned |
| **P1** | Article Writer $\to$ SEO Analyzer deep link shortcut | Planned |
