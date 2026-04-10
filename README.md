# 🚀 Rapid-AI (Minor Project)

![Project Banner](https://via.placeholder.com/1000x300?text=Rapid-AI+Banner)

A sophisticated full-stack AI-integrated web platform that combines the power of **Generative AI** with a modern, secure, and responsive web architecture.

This project offers an ecosystem of various AI tools, ranging from text generation to document parsing and image manipulation, all wrapped inside a beautiful UI with seamless authentication.

---

## 🌟 Key Features

- **🔐 Secure Authentication:** Complete user management, protected routes, and session handling powered by [Clerk](https://clerk.com/).
- **🤖 Comprehensive AI Tools:** Leverages [OpenAI](https://openai.com/) to process intelligent queries, including generating blog titles, writing articles, and reviewing resumes.
- **📄 PDF Parsing:** Upload constraint-heavy PDF documents (e.g., Resumes/CVs) to safely analyze and extract deep insights.
- **🎨 Modern UI & UX:** Highly responsive design crafted with **React 19**, styled via **Tailwind CSS**, and utilizing sleek animations via **Framer Motion**.
- **☁️ Cloud Storage & Media:** Robust and optimized image management directly integrated with **Cloudinary**.
- **🗄️ Serverless Database:** Lightweight, lightning-fast edge database handling using **Neon (Serverless PostgreSQL)**.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React.js (v19) via Vite
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router v7
- **Animations:** Framer Motion
- **Icons & Markdown:** Lucide React, React Markdown, React Simple Typewriter
- **State/Notifications:** React Hot Toast

### Backend (Server)
- **Runtime & Framework:** Node.js, Express.js
- **Database:** Serverless PostgreSQL via Neon (`@neondatabase/serverless`)
- **Authentication:** `@clerk/express`
- **File Handling:** Multer, Parse PDF (`pdf-parse`)
- **Media API:** Cloudinary
- **AI Integration:** OpenAI API SDK

---

## 📂 Project Structure

```text
Minor Project
├── client/                 # Frontend React Application
│   ├── public/             # Static Assets
│   ├── src/                
│   │   ├── assets/         # Images, global styles
│   │   ├── components/     # Reusable UI React components
│   │   ├── pages/          # Full page layouts (Home, Dashboard, AI Tools, etc.)
│   │   ├── App.jsx         # App Entry Component
│   │   └── main.jsx        # Root Render Component
│   ├── package.json        
│   └── vite.config.js      
├── server/                 # Backend Express API Server
│   ├── configs/            # Configuration for Database and Media APIs
│   ├── controllers/        # Logical controllers (userController, aiController)
│   ├── middlewares/        # Custom Authentication & request validators
│   ├── routes/             # Express API Endpoints (userRoutes, aiRoutes)
│   ├── server.js           # Server Entry Point
│   └── package.json        
└── README.md
```

---

## 🚀 Getting Started

Follow the instructions below to install and run the application on your local machine.

### Prerequisites

Ensure you have the following installed to run this project smoothly:
* Node.js (v18.x or later)
* npm (Node Package Manager)
* PostgreSQL Instance or Neon Account
* Cloudinary API Credentials
* Clerk Auth Credentials
* OpenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd "Minor Project"
   ```

2. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install Server Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

---

## ⚙️ Environment Configuration

This project requires environment variables which are not pushed to the repository for security reasons. You will need to create a `.env` file in both the `client` and `server` directories.

### Server Environment Variables (`server/.env`)

```env
PORT=5000

# Database URL (Neon PostgreSQL connection string)
DATABASE_URL=postgres://<user>:<password>@<host>/<database>?sslmode=require

# Clerk Keys
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI Key
OPENAI_API_KEY=sk-...
```

### Client Environment Variables (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```
*(Make sure to match the client's Clerk publishable key with the server's)*

---

## 💻 Running the Application

You need to run both the frontend (client) and the backend (server) concurrently.

1. **Start the Backend Server:**
   Open a terminal, navigate to the `server` directory, and run:
   ```bash
   cd server
   npm run dev       # or npm start
   ```

2. **Start the Frontend Client:**
   Open a second terminal, navigate to the `client` directory, and start the app:
   ```bash
   cd client
   npm run dev
   ```

The client application should now be accessible in your browser at `http://localhost:5173`.

---

## 📜 Available Scripts

### In the `client` directory:
- `npm run dev` : Starts the Vite development server.
- `npm run build` : Builds the React frontend for production.
- `npm run lint` : Lints codebase using ESLint.

### In the `server` directory:
- `npm run server` : Starts the Server with nodemon (auto-reloads on edits).
- `npm start` : Starts the Server directly with basic Node runtime.
Commands

*   `npm run build` (in the `client` folder) to build the client for production.

