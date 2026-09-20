# 🚀 Rapid.ai 2.0 — AI Content, Resume, and Document Intelligence Platform

> A full-stack SaaS platform built on top of the existing Rapid.ai foundation, enhanced with transparent NLP analysis, resume-to-job matching, document intelligence, and SEO optimization for content workflows.

> 🔗 **Live Demo:** [https://rapid-ai-ten-rust.vercel.app/](https://rapid-ai-ten-rust.vercel.app/)

---

## ✨ Platform Highlights

| Feature | Description |
|---------|-------------|
| 🤖 **10 AI Tools** | Article Writer, Blog Titles, Image Generation, Background Removal, Object Eraser, PDF Summarizer, Resume Reviewer, **Resume–Job Matcher (2.0)**, **Document & Research Analyzer (2.0)**, **Content & SEO Analyzer (2.0)** |
| 🔬 **Deterministic NLP Engine** | Transparent TF-IDF scoring, cosine similarity, 200+ skill taxonomy, readability analysis, keyword density, document profiling, and SEO heuristics |
| 🎨 **Premium UI/UX** | Glassmorphism, dark mode, responsive dashboard, smooth transitions, animated score rings, and an app-like studio layout |
| 🔐 **Clerk Authentication** | Secure sign-in/sign-up, user metadata, plan checks, and premium access controls |
| 💳 **Subscription Model** | 10 free credits for free users; premium users unlock unlimited access and priority tool access |
| 📊 **Analytics Dashboard** | Recent creations, activity tracking, premium analytics insights, and UI state management |
| 🌐 **Community Gallery** | Share generated images publicly, with likes and community visibility |
| 🎬 **Demo Experience** | Embedded landing-page video modal and polished promotional flow |
| ⚡ **Studio Layout** | Fixed sidebar + header + scrollable work area designed like a native desktop workspace |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** + **Vite** | Fast SPA development and frontend build tooling |
| **Tailwind CSS v4** | Utility-first styling with dark mode support |
| **React Router v7** | Routing, nested layouts, and page transitions |
| **Clerk React** | Authentication UI and session hooks |
| **Framer Motion** | Smooth accordion and interactive motion effects |
| **Recharts** | Dashboard analytics visualizations |
| **Lucide React** | Clean icon system across the app |
| **React Markdown** | Rendering AI-generated article and audit output |
| **React Hot Toast** | User notifications and action feedback |
| **Axios** | API communication between client and server |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** + **Express** | REST API server and application layer |
| **Neon PostgreSQL** | Serverless relational database for user records and creation history |
| **Clerk Express** | JWT authentication and plan validation |
| **OpenAI SDK** | Interface to Google Gemini for AI generation and enhancement |
| **Custom NLP Engine** | Deterministic text analysis for scoring, similarity, readability, keyword density, and document classification |
| **Cloudinary** | Image storage, transformation, and media management |
| **Multer** | Upload handling for PDFs and image processing tools |
| **pdf-parse** | PDF text extraction and document analysis |

---

## 🧩 AI Tools Overview

### ✍️ Article Writer
Generate long-form article content on any topic with multiple length options. Output is rendered in markdown and can be passed directly into the SEO analyzer for optimization.

### #️⃣ Blog Title Generator
Create SEO-oriented title suggestions and topic angles for marketing, blog, and content strategy workflows.

### 🖼️ Image Generation
Generate custom AI visuals using descriptive prompts and style presets.

### 🧹 Background Removal
Remove image backgrounds automatically for product, profile, and marketing assets.

### ✂️ Object Removal
Remove unwanted objects from images while preserving the surrounding scene naturally.

### 📄 PDF Summarizer
Upload a PDF and receive a structured summary of the main points and themes.

### 💼 Resume Reviewer
Analyze a resume for formatting, keyword alignment, structure quality, and content improvements.

### 🎯 Resume–Job Matcher (Rapid.ai 2.0)
Upload a resume PDF and paste a job description to get a transparent skill match score, missing skills, extra skills, and AI-powered gap advice using a 70/30 weighted formula.

### 📑 Document & Research-Paper Analyzer (Rapid.ai 2.0)
Analyze PDFs for readability, structure, keyword themes, research-paper heuristics, and AI-generated breakdowns for executive summaries, methodology, findings, and limitations.

### 🚀 Content & SEO Analyzer (Rapid.ai 2.0)
Audit written content for keyword density, heading hierarchy, readability, lexical diversity, passive voice, and actionable SEO recommendations.

---

## 🏗️ Project Structure

```text
Rapid.ai 2.0/
├── client/                                  # React frontend
│   ├── public/                              # Static assets and branding content
│   ├── src/
│   │   ├── assets/                          # Images, icons, metadata, and static tool data
│   │   ├── components/                      # Shared UI components
│   │   │   ├── Navbar.jsx                   # Landing page navigation
│   │   │   ├── Hero.jsx                     # Hero section and call-to-action
│   │   │   ├── Sidebar.jsx                  # Dashboard navigation
│   │   │   ├── Ai_Tools.jsx                 # Landing page tool cards
│   │   │   ├── CreationItem.jsx             # Creation history card
│   │   │   ├── Testimonial.jsx              # Social proof section
│   │   │   ├── Plan.jsx                     # Billing / plan display
│   │   │   ├── FAQ.jsx                      # FAQ section
│   │   │   ├── Footer.jsx                   # Site footer
│   │   │   └── ThemeToggle.jsx              # Light/Dark mode toggle
│   │   ├── context/
│   │   │   └── ThemeContext.jsx             # Theme state provider
│   │   ├── pages/
│   │   │   ├── Home.jsx                     # Landing page composition
│   │   │   ├── Layout.jsx                   # Studio-style authenticated layout
│   │   │   ├── Dashboard.jsx                # Main analytics dashboard
│   │   │   ├── WriteArticle.jsx             # Article generation tool
│   │   │   ├── BlogTitles.jsx               # Blog titles generator
│   │   │   ├── GenerateImages.jsx           # AI image generation tool
│   │   │   ├── RemoveBackground.jsx         # Background removal tool
│   │   │   ├── RemoveObject.jsx             # Object eraser tool
│   │   │   ├── PdfSummarizer.jsx            # PDF summarization tool
│   │   │   ├── ReviewResume.jsx             # Resume review page
│   │   │   ├── ResumeJobMatch.jsx           # Rapid.ai 2.0 resume-job matcher
│   │   │   ├── DocumentAnalyzer.jsx         # Rapid.ai 2.0 document analyzer
│   │   │   ├── ContentSeoAnalyzer.jsx       # Rapid.ai 2.0 SEO analyzer
│   │   │   ├── ResumeWorkspace.jsx          # Resume tool workspace container
│   │   │   ├── ContentWorkspace.jsx         # Content workspace container
│   │   │   ├── Community.jsx                # Public gallery
│   │   │   └── Settings.jsx                 # Account and settings
│   │   ├── App.jsx                          # Route definitions
│   │   └── main.jsx                         # Root render and app bootstrap
│   ├── package.json
│   └── vite.config.js
│
├── server/                                  # Express backend
│   ├── configs/
│   │   ├── db.js                            # Neon PostgreSQL connection setup
│   │   ├── cloudinary.js                    # Cloudinary configuration
│   │   └── multer.js                        # Upload handling for multipart files
│   ├── controllers/
│   │   ├── aiController.js                  # Core AI generation endpoints
│   │   ├── analysisController.js            # Rapid.ai 2.0 analytic endpoints
│   │   └── userController.js                # User and creation logic
│   ├── middlewares/
│   │   ├── auth.js                          # Clerk auth and plan enforcement
│   │   └── toolAccess.js                    # Tool gating for premium features
│   ├── routes/
│   │   ├── aiRoutes.js                      # Backend route definitions
│   │   └── userRoutes.js                    # User API routes
│   ├── utils/
│   │   ├── nlpEngine.js                     # Reusable NLP analysis engine
│   │   └── pdfHelper.js                     # PDF helper/analysis utilities
│   ├── server.js                           # Express app entry point
│   ├── package.json
│   └── vercel.json
│
├── implementation_plan.md                  # Architecture audit and rollout plan
├── README.md                               # Project documentation
├── .gitignore
├── .env.example                            # Environment template (if used)
└── package.json                            # Optional workspace-level config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.x or later
- **npm** (comes with Node.js)
- A [Neon](https://neon.tech/) PostgreSQL database
- A [Clerk](https://clerk.com/) application
- A [Cloudinary](https://cloudinary.com/) account
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini

### 1. Clone & Install

```bash
git clone <repository_url>
cd "Rapid.ai 2.0"

cd client
npm install

cd ../server
npm install
```

### 2. Environment Variables

Create `.env` files in both directories:

**`server/.env`**
```env
PORT=3000
DATABASE_URL=postgres://<user>:<password>@<host>/<database>?sslmode=require

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key
```

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BASE_URL=http://localhost:3000
```

### 3. Database Setup

Run this SQL in your Neon console to create the `creations` table:

```sql
CREATE TABLE creations (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    prompt TEXT,
    content TEXT,
    type TEXT,
    publish BOOLEAN DEFAULT FALSE,
    likes TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    update_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Run the Application

```bash
# Terminal 1 — Backend
cd server
npm run server

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📜 Available Scripts

| Directory | Command | Description |
|-----------|---------|-------------|
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Build production bundle |
| `client/` | `npm run lint` | Linting with ESLint |
| `server/` | `npm run server` | Start backend with nodemon |
| `server/` | `npm start` | Start backend with Node.js |

---

## 🎨 Design System

- **Color Palette**: Slate neutrals with primary purple accent (#5044E1) and tool-specific gradients
- **Typography**: Clean sans-serif system stack with bold product headings
- **Dark Mode**: Full light/dark support with synchronized transitions
- **Glassmorphism**: Used on navigation, cards, and overlays
- **Studio Layout**: Fixed sidebar and header with dedicated workspaces for content and resume tools
- **Animations**: Framer Motion transitions, hover interactions, and content reveal effects

---

## 🔒 Authentication & Credit System

| Plan | Credits | Analytics | Features |
|------|---------|-----------|----------|
| **Free** | 10 generations | Recent creations access | Core AI tools |
| **Premium** | Unlimited | Full dashboard analytics | Premium and gated AI tools |

- Credits are tracked through the app database and synced into Clerk metadata.
- Protected routes and premium-only tools enforce the subscription state centrally.

---

## ▶️ Demo Video

https://github.com/user-attachments/assets/6d902712-3e5a-4efb-83fe-7f974456a382

---

## 📄 License

This project is developed as a **Rapid.ai 2.0 product initiative** and is intended for portfolio, learning, and SaaS prototype use.

---

<p align="center">
  Built with ❤️ using React, Express, Gemini AI, Neon PostgreSQL, and the Rapid.ai 2.0 intelligence stack
</p>
