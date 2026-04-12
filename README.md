# 🚀 Rapid-AI Powered Content Creation Platform

> A full-stack SaaS platform that combines **6 powerful AI tools** into a single, beautifully designed workspace — from article generation to image editing, all powered by Google Gemini & Cloudinary.

> 🔗 **Live Demo:** [https://rapid-ai-ten-rust.vercel.app/](https://rapid-ai-ten-rust.vercel.app/)

---

## ✨ Platform Highlights

| Feature | Description |
|---------|-------------|
| 🤖 **6 AI Tools** | Article Writer, Blog Title Generator, Image Generation, Background Removal, Object Eraser, Resume Reviewer |
| 🎨 **Premium UI/UX** | Glassmorphic design, dark mode, smooth 300ms theme transitions, responsive layouts |
| 🔐 **Clerk Authentication** | Secure sign-in/sign-up, session management, user metadata, and Stripe-integrated billing |
| 💳 **Subscription Model** | 10 free credits for new users, Premium plan for active subscribers |
| 📊 **Analytics Dashboard** | Real-time creation tracking, 7-day activity chart (Premium), and localStorage caching for instant loads |
| 🌐 **Community Gallery** | Share AI-generated images publicly, like/unlike system with real-time updates |
| 🎬 **Watch Demo** | Embedded video modal with glassmorphic overlay directly on the landing page |
| ⚡ **Studio Layout** | Fixed sidebar & header with independently scrollable content — feels like a native desktop app |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** + **Vite** | Lightning-fast SPA framework |
| **Tailwind CSS v4** | Utility-first styling with dark mode support |
| **React Router v7** | Client-side routing & nested layouts |
| **Clerk React** | Authentication UI components & hooks |
| **Framer Motion** | Accordion animations in Dashboard |
| **Recharts** | Analytics area charts (Premium dashboard) |
| **Lucide React** | Consistent icon system |
| **React Markdown** | AI-generated article rendering |
| **React Simple Typewriter** | Hero section typing animation |
| **React Hot Toast** | Toast notifications |
| **Axios** | HTTP client for API communication |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** + **Express** | REST API server |
| **Neon PostgreSQL** | Serverless database for creations & user data |
| **Clerk Express** | JWT-based route protection & user metadata |
| **OpenAI SDK** | Interface to Google Gemini 3 Flash model |
| **Cloudinary** | Cloud image storage & transformation |
| **Multer** | Multipart file upload handling |
| **pdf-parse** | Resume PDF text extraction |

---

## 🧩 AI Tools Overview

### ✍️ Article Writer
Generate long-form, high-quality articles on any topic. Choose between **Short**, **Medium**, and **Long** lengths. Output is rendered as rich Markdown with proper headings, paragraphs, and lists.

### #️⃣ Blog Title Generator
Enter a topic and receive **8-10 creative, SEO-optimized blog title suggestions** — perfect for content strategists and bloggers.

### 🖼️ Image Generation
Describe your vision in a detailed prompt, select a style preset (Realistic, Anime, Ghibli, etc.), and generate AI-powered images. Toggle **Public** to share with the Community.

### 🧹 Background Removal
Upload any image and the AI isolates the subject by removing the background entirely — ideal for product photos and profile pictures.

### ✂️ Object Removal
Upload an image and describe the object to remove. The AI intelligently fills in the gap, producing a clean result.

### 📄 Resume Reviewer
Upload a PDF resume and receive a detailed AI-powered analysis covering structure, content quality, keyword optimization, and improvement suggestions.

---

## 🏗️ Project Structure

```
Minor Project/
├── client/                          # React Frontend
│   ├── public/                      # Static assets (gradient bg, favicon)
│   ├── src/
│   │   ├── assets/                  # Images, icons, tool data definitions
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx           # Landing page glassmorphic navbar
│   │   │   ├── Hero.jsx             # Hero section with typewriter + video modal
│   │   │   ├── Sidebar.jsx          # Dashboard sidebar navigation
│   │   │   ├── Ai_Tools.jsx         # AI tools grid for landing page
│   │   │   ├── CreationItem.jsx     # Expandable creation card (accordion)
│   │   │   ├── Testimonial.jsx      # Infinite marquee testimonials
│   │   │   ├── Plan.jsx             # Clerk PricingTable integration
│   │   │   ├── FAQ.jsx              # Expandable FAQ section
│   │   │   ├── Footer.jsx           # Multi-column footer
│   │   │   └── ThemeToggle.jsx      # Light/Dark mode toggle
│   │   ├── context/
│   │   │   └── ThemeContext.jsx      # Theme provider (localStorage persisted)
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page (all sections composed)
│   │   │   ├── Layout.jsx           # Authenticated app shell (header + sidebar + outlet)
│   │   │   ├── Dashboard.jsx        # Analytics, stats, recent creations
│   │   │   ├── WriteArticle.jsx     # Article generation tool
│   │   │   ├── BlogTitles.jsx       # Blog title generation tool
│   │   │   ├── GenerateImages.jsx   # AI image generation tool
│   │   │   ├── RemoveBackground.jsx # Background removal tool
│   │   │   ├── RemoveObject.jsx     # Object eraser tool
│   │   │   ├── ReviewResume.jsx     # PDF resume analysis tool
│   │   │   ├── Community.jsx        # Public gallery with like system
│   │   │   └── Settings.jsx         # Account, billing, appearance, security
│   │   ├── App.jsx                  # Route definitions
│   │   └── main.jsx                 # Root render with Clerk & Theme providers
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── configs/
│   │   ├── db.js                    # Neon PostgreSQL connection
│   │   └── cloudinary.js            # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── aiController.js          # AI generation logic (all 6 tools)
│   │   └── userController.js        # User creations & community endpoints
│   ├── middlewares/
│   │   └── auth.js                  # JWT validation, plan checking, credit sync
│   ├── routes/
│   │   ├── aiRoutes.js              # POST routes for AI tools
│   │   └── userRoutes.js            # GET/POST routes for user data
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── dev-log.txt                      # Detailed development journal (33 entries)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.x or later
- **npm** (comes with Node.js)
- A [Neon](https://neon.tech/) PostgreSQL database
- A [Clerk](https://clerk.com/) application (with Pricing Table configured)
- A [Cloudinary](https://cloudinary.com/) account
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### 1. Clone & Install

```bash
git clone <repository_url>
cd "Minor Project"

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Environment Variables

Create `.env` files in both directories:

**`server/.env`**
```env
PORT=3000

# Neon PostgreSQL
DATABASE_URL=postgres://<user>:<password>@<host>/<database>?sslmode=require

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini (via OpenAI SDK)
GEMINI_API_KEY=your_gemini_api_key

# ClipDrop (Image Processing)
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
| `client/` | `npm run dev` | Start Vite dev server (HMR enabled) |
| `client/` | `npm run build` | Build production bundle |
| `client/` | `npm run lint` | Lint with ESLint |
| `server/` | `npm run server` | Start with Nodemon (auto-restart) |
| `server/` | `npm start` | Start with plain Node.js |

---

## 🎨 Design System

- **Color Palette**: Slate (backgrounds), Primary purple (#5044E1), accent gradients per tool
- **Typography**: System font stack with semibold headings
- **Dark Mode**: Full support with `dark:` Tailwind utilities, 300ms synchronized transitions
- **Glassmorphism**: Applied to Navbar, Sidebar, and modal overlays (`backdrop-blur-lg`, `bg-white/20`)
- **Layout Pattern**: Fixed header + fixed sidebar + scrollable content area ("Studio Mode")
- **Animations**: Framer Motion accordions, CSS keyframe modals, Typewriter hero text

---

## 🔒 Authentication & Credit System

| Plan | Credits | Analytics | Features |
|------|---------|-----------|----------|
| **Free** | 10 generations | Recent Creations only | All 6 AI tools |
| **Premium** | Unlimited | Full 7-day activity chart | All 6 AI tools + priority |

- Credits are tracked via **database row count** (source of truth), synced to Clerk `publicMetadata` for instant UI display.
- The auth middleware automatically reconciles metadata on every authenticated request.

---

## 📄 License

This project is developed as a **Minor Project** for B.Tech CSE (6th Semester). 

---

<p align="center">
  Built with ❤️ using React, Express, Gemini AI & Neon PostgreSQL
</p>
