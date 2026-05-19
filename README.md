# 🌐 AI-Powered Language Learning Assistant

An advanced, gamified, and hyper-personalized language learning platform built with **Next.js**, **React 19**, and multi-agent AI workflows powered by **LangGraph** and **LangChain**. The system adapts to each user's unique learning pace and vocabulary history, dynamically generating curriculum, interactive modules, levels, and worksheets.

---

## 🚀 GitHub Repository One-Liner (Short Description)
> **An advanced, gamified language learning assistant powered by LangGraph AI agents, Next.js 16, and React 19—featuring dynamic curriculum generation, progress tracking, and multi-LLM support (DeepSeek & Gemini).**

---

## 🌟 Key Features

*   **🤖 LangGraph Multi-Agent Workflows**: A sophisticated generative layer that powers curriculum planners, diagnostic testing, lesson generators, vocabulary creators, and grading workflows.
*   **🧠 Adaptive Learning Engine**: Evaluates user performance dynamically and modifies the learning roadmap (Syllabus, Grammar, and Vocabulary) based on real-time proficiency levels.
*   **🔄 Multi-LLM Adapter Architecture**: Seamless runtime switching between **DeepSeek-v4 (via NVIDIA NIM)** and **Google Gemini 2.5 Flash** for optimal cost, speed, and output quality.
*   **📊 Gamified Dashboard**: Features modern, interactive, and beautiful interfaces for progress tracking, daily goals, vocabulary history, achievements, and statistics.
*   **📝 Dedicated Learning Workspaces**:
    *   **Hangul/Alphabet Lab**: Interactive worksheets for characters and vocabulary.
    *   **Grammar Playground**: Visual conjugation tables, irregular form rules, and live practice.
    *   **Vocabulary Flashcards**: Intelligent spaced repetition helper displaying daily custom words.
    *   **Numbers Worksheet**: Practical worksheets covering native and Sino-Korean counting systems.
*   **⏰ Production-Ready Hybrid Cron**: Dual-mode support for background scheduling:
    *   **Vercel-native serverless cron jobs** with robust `Authorization: Bearer` security verification.
    *   **Local persistent `node-cron` daemon** for offline VPS (e.g. Hostinger) or local development.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 16 (App Router) & React 19
*   **AI Agent Layer**: LangGraph JS/TS, LangChain Core, Zod structured output bindings
*   **Database & ORM**: Prisma ORM, Neon Serverless PostgreSQL
*   **Styling & UI**: Tailwind CSS, Framer Motion (for smooth fluid micro-animations), Lucide Icons
*   **Security & Auth**: JWT (JSON Web Tokens) with standard middleware validation filters

---

## 📂 Project Architecture

```mermaid
graph TD
    A[Next.js App Router] -->|User Interaction| B[API Middleware]
    B -->|Database Operations| C[(Prisma / Neon PostgreSQL)]
    B -->|AI Request| D[Model Router /src/lib/model.ts]
    D -->|Lazy Proxy| E{ACTIVE_LLM}
    E -->|deepseek| F[NVIDIA NIM DeepSeek-v4-pro]
    E -->|gemini| G[Gemini 2.5 Flash]
    
    A -->|Secure Daily Trigger| H[Unified Cron Route /api/cron]
    H -->|Agent Generation| I[LangGraph Agent Workflows]
    I -->|Course Builder| J(courseGenerator)
    I -->|Daily Content| K(moduleGenerator)
    I -->|Level Evaluator| L(levelEvaluator)
    I -->|Word Generator| M(wordGenerator)
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory:

```env
# Database Configuration (PostgreSQL / Neon)
DATABASE_URL="postgresql://username:password@hostname/neondb?sslmode=verify-full"

# AI Model Routing
ACTIVE_LLM="deepseek" # "deepseek" or "gemini"

# NVIDIA NIM API Configuration (DeepSeek)
NVIDIA_NIM_API_KEY="your-nvidia-nim-api-key"
NVIDIA_NIM_BASE_URL="https://integrate.api.nvidia.com/v1"

# Google Gemini API Configuration
GEMINI_API_KEY="your-gemini-api-key"

# Next.js Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Secure Cron Authorization Key
CRON_SECRET="your-secure-random-token-here"
```

---

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/language-learning-ai-assistant.git
cd language-learning-ai-assistant
```

### 2. Install dependencies
```bash
pnpm install
# or
npm install
```

### 3. Initialize Prisma and migrate database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the development server
```bash
pnpm run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dashboard.

---

## 🤖 Dynamic Workflows & Pipelines

*   **Daily Module Pipeline**: Fetches daily learning goals, builds modular interactive lessons tailored to user progress, and updates learned vocabulary databases dynamically.
*   **Weekend Diagnostic Tests**: Generates custom test structures based on active user progress data to test retention, giving personalized grades and detailed constructive AI feedback.
*   **Level Evaluation**: Translates direct user grammar and reading exercises into language proficiency metrics to dynamically adjust course complexity.

---

## ☁️ Deployment

### Vercel (Recommended)
This repository is pre-configured with **Vercel serverless functions** and **Vercel Cron Jobs**:
1. Connect your repository to Vercel.
2. In **Environment Variables**, add the environment variables described above.
3. Vercel will automatically read `vercel.json` and configure `/api/cron/word-of-the-day` to trigger at midnight daily.

### VPS (Hostinger / DigitalOcean / AWS EC2)
1. Set up a persistent runner like **PM2** to run Next.js:
   ```bash
   pm2 start npm --name "assistant" -- start
   ```
2. The built-in persistent offline scheduler will automatically spin up on start and run tasks at midnight.
3. *(Alternative)* Configure standard Linux `crontab` to ping the secure endpoint securely:
   ```bash
   crontab -e
   # Add:
   0 0 * * * curl -X GET "http://localhost:3000/api/cron/word-of-the-day" -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```
