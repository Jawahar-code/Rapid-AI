# Rapid-AI
A full-stack AI-integrated platform built with React and Express. Features secure authentication via Clerk, PDF parsing capabilities, and AI-driven responses using OpenAI. Powered by a Neon PostgreSQL database and Cloudinary for media management.
=======
# 🚀 AI-Powered Minor Project

A sophisticated full-stack web application that combines the power of **Generative AI** with a modern, secure web architecture.

### 🌟 Key Features
- **🔐 Secure Auth:** Complete user management and protected routes using Clerk.
- **🤖 AI Integration:** Leverages OpenAI for intelligent responses and document processing.
- **📄 PDF Parsing:** Ability to upload and analyze PDF content.
- **🎨 Modern UI:** Responsive design built with React 19, Tailwind CSS, and smooth animations via Framer Motion.
- **☁️ Cloud Storage:** Image management and optimization through Cloudinary.
- **🗄️ Database:** Robust data handling with Neon (Serverless PostgreSQL).


This repository contains the client and server code for the Minor Project.

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed a recent version of [Node.js](https://nodejs.org/) (which includes `npm`).

## Installation

To install the project dependencies, you need to run `npm install` in both the `client` and `server` directories.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd "Minor Project"
    ```

2.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

## Environment Configuration

This project requires environment variables which are not pushed to Git for security reasons. You will need to create a `.env` file in both the `client` and `server` directories.

### Server Environment Variables

Create a file named `.env` in the `server` directory and configure the following variables (ask the project owner for the exact values):

```env
# Example Server .env
PORT=...
MONGO_URI=...
# Add other necessary backend secret keys here
```

### Client Environment Variables

Create a file named `.env` in the `client` directory and configure the following variables:

```env
# Example Client .env
VITE_API_URL=http://localhost:<server_port>
# Add other necessary frontend variables here
```

## Running the Application

You need to run both the frontend (client) and the backend (server) concurrently.

1.  **Start the Backend Server:**
    Open a terminal, navigate to the `server` directory, and start the development server:
    ```bash
    cd server
    npm run dev  # or npm run server (depending on your package.json scripts)
    ```

2.  **Start the Frontend Client:**
    Open a second terminal, navigate to the `client` directory, and start the React app:
    ```bash
    cd client
    npm run dev
    ```

The client application should now be accessible in your browser (typically at http://localhost:5173).

## Useful Commands

*   `npm run build` (in the `client` folder) to build the client for production.

