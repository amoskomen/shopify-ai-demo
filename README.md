Shopify AI Product Intelligence Tool (Multi-LLM)
A high-performance Node.js agent that automates e-commerce copywriting by bridging the Shopify GraphQL Admin API with a resilient, multi-engine AI architecture.

🚀 Key Features
Multi-LLM Hybrid Engine: Dynamically orchestrates between Groq (Llama 3.3 70B) for sub-second inference and Google Gemini 1.5 Flash as a secondary high-context provider.

Resilient Fallback Architecture: Engineered with a 3-tier safety net:

Primary: Groq (High-speed Llama 3)

Secondary: Gemini (Redundancy)

Tertiary: Deterministic Mock Logic (Ensures 100% demo uptime even during global API outages).

GraphQL Mutation Engine: Performs authenticated write-back updates to the descriptionHtml field via Shopify's latest API version (v2026-01).

Inventory Discovery: Built-in --list flag to audit and retrieve live product titles directly from the Shopify catalog.

Enterprise Terminal UI: Real-time visualization using cli-progress to monitor the AI lifecycle and identify which engine is currently processing.

🛠️ Tech Stack
Runtime: Node.js v22+

AI Engines: Groq SDK (Llama 3.3), @google/generative-ai (Gemini)

E-commerce API: Shopify Admin GraphQL

UI/UX: cli-progress for real-time terminal feedback

Security: dotenv for secure credential management

⚙️ Setup & Execution
1. Clone & Install
Bash
git clone https://github.com/amoskomen/shopify-ai-demo
cd shopify-ai-demo
npm install
2. Environment Configuration
Create a .env file in the root directory:

Plaintext
SHOPIFY_STORE_URL=your-store-name.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxx...
GROQ_API_KEY=gsk_xxxx...
GEMINI_API_KEY=AIzaSyxxxx...
3. Usage
Audit Inventory: node index.js --list

Run AI Update: node index.js "Gift Card" (or any product title)

📸 Demo Output
Plaintext
==========================================
🚀 STARTING MULTI-LLM AGENT: amos-ai-demo.myshopify.com
🎯 TARGETING: "Gift Card"
==========================================

Step 1: Connecting to Shopify Inventory...
✅ Connection Established: "Gift Card"

🤖 AI Brain Thinking (Groq/Llama) | ████████████████████████████████████████ | 100%

✨ CONTENT READY: "Give the gift of choice with our premium Gift Card. Perfect for any occasion..."

Step 3: Syncing with Shopify Admin...
✅ SUCCESS: "Gift Card" updated live.
