Shopify AI Product Description Generator
A high-performance Node.js integration that automates e-commerce copywriting by bridging the Shopify GraphQL Admin API with Google Gemini 2.0/1.5 Flash. Built for speed, production-scale reliability, and graceful service degradation.

🚀 Key Features
Hybrid AI Engine: Dynamically generates professional product copy using Gemini 2.0/1.5 Flash.

Resilient Fallback Architecture: Engineered to detect API rate limits (429 errors) or service outages and automatically switch to a deterministic "Mock Logic" engine to ensure zero demo downtime.

GraphQL Mutation Engine: Performs precise, authenticated write-back updates to the descriptionHtml field via Shopify's latest API version.

Inventory Discovery: Built-in --list flag to audit and retrieve live product titles directly from the Shopify catalog.

Enterprise UX: Real-time terminal visualization using cli-progress to monitor the AI lifecycle and API sync status.

🛠️ Tech Stack
Runtime: Node.js v22+

AI SDK: @google/generative-ai (Gemini Pro/Flash)

E-commerce API: Shopify Admin GraphQL (v2026-01)

UI/UX: cli-progress for real-time terminal feedback

Security: dotenv for encrypted credential management

⚙️ Setup & Execution
Clone & Install:

Bash
git clone <your-repo-url>
cd shopify-ai-demo
npm install
Environment Configuration:
Create a .env file in the root directory:

Plaintext
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxx...
GEMINI_API_KEY=your_google_ai_key_here
Usage:

Audit Inventory: node index.js --list

Run AI Update: node index.js "The Complete Snowboard"

📸 Demo Output
Plaintext
==========================================
🚀 STARTING LIVE AI DEMO: amos-ai-demo.myshopify.com
🎯 TARGETING: "The Complete Snowboard"
==========================================

Step 1: Connecting to Shopify Inventory...
✅ Connection Established: "The Complete Snowboard"

🤖 AI Brain Thinking | ████████████████████████████████████████ | 100% | 100/100 Steps

✨ CONTENT READY: "Conquer the slopes with The Complete Snowboard. Engineered for maximum control and high-speed stability."

Step 3: Syncing with Shopify Admin...
✅ SUCCESS: "The Complete Snowboard" updated live.
