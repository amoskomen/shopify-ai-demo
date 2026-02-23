Shopify AI Product Description Generator
A high-performance Node.js integration that automates e-commerce copywriting by bridging the Shopify GraphQL Admin API with OpenAI's GPT models.

🚀 Features
GraphQL Mutation Engine: Fetches live product data and performs write-back updates to the Shopify Storefront.

Enterprise UX: Features a custom CLI progress tracking system for real-time monitoring of the AI lifecycle.

Smart Fallback Logic: Engineered with a "Mock Mode" to ensure 100% uptime during demonstrations or API rate-limiting events.

Secure Architecture: Implemented with environment-based credential management for production-ready security.

🛠️ Tech Stack
Runtime: Node.js v22+

Primary APIs: Shopify Admin API (2026-01), OpenAI API (GPT-4o)

UI/UX: cli-progress for terminal visualization

Security: dotenv for protected environment variables

⚙️ Setup
Clone & Install:

Bash
git clone <your-repo-url>
cd shopify-ai-demo
npm install
Environment Configuration:
Create a .env file with the following keys:

Plaintext
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxx...
OPENAI_API_KEY=sk-xxxx...
Execution:

Bash
node index.js
📸 Demo Output
Plaintext
==========================================
🚀 STARTING LIVE AI DEMO: amos-ai-demo.myshopify.com
==========================================

Step 1: Connecting to Shopify Inventory...
✅ Target Found: "Premium Weekend Bag"

🤖 AI Processing | ████████████████████████████████████████ | 100% | 100/100 Steps

✨ AI Generated Content: "Elevate your travels with the Premium Weekend Bag. Crafted for durability and sophisticated style..."

Step 3: Syncing with Shopify Admin...
✅ LIVE UPDATE SUCCESSFUL: Storefront updated.
