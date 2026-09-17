import express from 'express';
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview, summarizePdf } from '../controllers/aiController.js';
import { resumeJobMatch, analyzeDocument } from '../controllers/analysisController.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post('/generate-blog-title', auth, generateBlogTitle)
aiRouter.post('/generate-image', auth, generateImage)
aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground)
aiRouter.post('/remove-object', upload.single('image'), auth, removeImageObject)
aiRouter.post('/summarize-pdf', upload.single('file'), auth, summarizePdf)
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview)

// Rapid.ai 2.0 Feature 1: Resume-Job Match & Skill-Gap Analysis
aiRouter.post('/resume-job-match', upload.single('resume'), auth, resumeJobMatch)

// Rapid.ai 2.0 Feature 2: Intelligent Document & Research-Paper Analyzer
aiRouter.post('/analyze-document', upload.single('document'), auth, analyzeDocument)

export default aiRouter; 