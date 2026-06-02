# ✨ AI Resume Analyzer SaaS

A modern, high-performance web application designed to automatically scan, score, and rebuild resumes using the power of **Google Gemini AI**. Featuring a stunning glassmorphic UI, a Bento-Box dashboard, and native Google Authentication.

![Application Layout](https://i.imgur.com/your-screenshot-link.png)

## 🚀 Features
*   **Bento-Box SaaS Dashboard:** Data-heavy results mapped into a clean, 12-column responsive layout.
*   **Glassmorphism UI:** Built with Tailwind CSS and animated using Framer Motion (hover-lifts, dynamic progress circles, floating neon blobs).
*   **Google Auth Integration:** Secure, instant user login orchestrated through a highly resilient **Supabase** backend. 
*   **Gemini AI Parsing Engine:** Automatically extracts `text` out of PDFs and runs proprietary custom prompts to identify:
    *   **Resume Score (0-10) & Percentile**
    *   **ATS Keywords (Found & Missing)**
    *   **Core Strengths & Hidden Weaknesses**
    *   **Top 3 Recommended Job Roles**
*   **Auto Resume Rewriter:** Capable of intelligently rewriting weak bullet points on the fly. 

---git commit -m "Updated project with new changes"

## 🛠️ Tech Stack

**Frontend:**
*   React 18 + Vite
*   Tailwind CSS (Styling)
*   Framer Motion (Micro-interactions & Physics animations)
*   Lucide React (Icons)
*   Supabase JS Client

**Backend:**
*   Node.js & Express
*   Multer (PDF parsing & file management)
*   Google Gemini SDK (`@google/genai`)

---

## ⚙️ Local Setup Guide

### 1. Prerequisites
You will need Node.js installed on your machine. You will also need active API keys for both Google Gemini and Supabase.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your Gemini key:
   ```env
   GEMINI_API_KEY="your_google_gemini_api_key_here"
   PORT=5000
   ```
4. Start the server (it will run on `localhost:5000`):
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` folder and paste your Supabase credentials:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your_anon_public_key"
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### 4. Running the App
Once both terminals are running, open your browser and go to `http://localhost:5173`. Click the "Continue with Google" button to jump right into the dashboard!

---

## 🤝 Contributing
Feel free to drop a pull request if you want to optimize the Gemini prompts, transition the state management to Redux/Zustand, or add Stripe payment gateways for the Pro version!

*Developed with ❤️*
