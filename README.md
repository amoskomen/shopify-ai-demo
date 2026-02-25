# 🚀 Shopify AI Product Agent (Full-Stack)

A professional-grade AI agent that automates Shopify product metadata optimization using a **Multi-LLM Resilience Pipeline**. Built for high-availability e-commerce workflows.

## 📂 Project Architecture
- **/backend**: Node.js + Express server with a 3-tier failover strategy.
- **/frontend**: React + Vite dashboard for real-time inventory auditing and 1-click optimization.

## 🧠 Multi-LLM Resilience Strategy
To ensure 100% uptime for merchants, the agent orchestrates between multiple providers:
1. **Tier 1: Groq (Llama 3.3)** - Primary engine for sub-second inference speed.
2. **Tier 2: Mistral AI** - High-reliability secondary failover for regional availability.
3. **Tier 3: Mock Safety Logic** - Deterministic fallback to ensure valid Shopify syncs even during total API outages.

## ⚙️ Setup Instructions

### 1. Backend Configuration
- Navigate to `/backend`
- Create a `.env` file based on `.env.example`
- Install dependencies: `npm install`
- Start server: `node server.js` (Runs on port 5000)

### 2. Frontend Configuration
- Navigate to `/frontend`
- Install dependencies: `npm install`
- Start dashboard: `npm run dev`

## 🛠 Tech Stack
- **AI:** Groq SDK, Mistral API
- **E-commerce:** Shopify GraphQL Admin API
- **Frontend:** React, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, Dotenv
