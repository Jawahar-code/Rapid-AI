import express from 'express';
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview, summarizePdf } from '../controllers/aiController.js';
import { resumeJobMatch, analyzeDocument, analyzeContentSeo } from '../controllers/analysisController.js';
import { auth } from '../middlewares/auth.js';
import { premiumOnly } from '../middlewares/toolAccess.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post('/generate-blog-title', auth, generateBlogTitle)
aiRouter.post('/generate-image', auth, premiumOnly, generateImage)
aiRouter.post('/remove-image-background', auth, premiumOnly, upload.single('image'), removeImageBackground)
aiRouter.post('/remove-object', auth, premiumOnly, upload.single('image'), removeImageObject)
aiRouter.post('/summarize-pdf', upload.single('file'), auth, summarizePdf)
aiRouter.post('/resume-review', auth, premiumOnly, upload.single('resume'), resumeReview)

// Rapid.ai 2.0 Feature 1: Resume-Job Match & Skill-Gap Analysis
aiRouter.post('/resume-job-match', auth, premiumOnly, upload.single('resume'), resumeJobMatch)

// Rapid.ai 2.0 Feature 2: Intelligent Document & Research-Paper Analyzer
aiRouter.post('/analyze-document', auth, premiumOnly, upload.single('document'), analyzeDocument)

// Rapid.ai 2.0 Feature 3: AI Content & SEO Analyzer
aiRouter.post('/analyze-content-seo', auth, premiumOnly, analyzeContentSeo)

export default aiRouter; 