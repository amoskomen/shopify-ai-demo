Shopify AI Product Description Generator
A high-performance Node.js integration that automates e-commerce copywriting by bridging the Shopify GraphQL Admin API with generative logic. Built for speed, flexibility, and production-scale reliability.

🚀 Features
Dynamic Command-Line Targeting: Update any product in your store by name directly from the terminal.

Inventory Discovery: Built-in --list flag to audit and retrieve live product titles from the Shopify catalog.

GraphQL Mutation Engine: Performs precise write-back updates to the descriptionHtml field via the Shopify 2026-01 API.

Smart Fallback Logic: Engineered with a product-aware "Mock Mode" to ensure 100% uptime during demonstrations.

Enterprise UX: Real-time terminal visualization using cli-progress for monitoring the AI lifecycle.

🛠️ Tech Stack
Runtime: Node.js v22+

API: Shopify Admin GraphQL API (v2026-01)

UI/UX: cli-progress for real-time terminal feedback.

Security: dotenv for protected environment variables and credential management.

⚙️ Setup & Execution
Clone & Install:

Bash
git clone <your-repo-url>
cd shopify-ai-demo
npm install
Environment Configuration:
Create a .env file with your credentials:

Plaintext
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxx...
Usage:

To list all products:

Bash
node index.js --list
To update a specific product:

Bash
node index.js "The Complete Snowboard"
📸 Demo Output
Plaintext
==========================================
🚀 STARTING LIVE AI DEMO: amos-ai-demo.myshopify.com
🎯 TARGETING: "The Complete Snowboard"
==========================================

Step 1: Connecting to Shopify Inventory...
✅ Connection Established: "The Complete Snowboard"

🤖 AI Processing | ████████████████████████████████████████ | 100% | 100/100 Steps

✨ AI Generated Content: "Conquer the slopes with The Complete Snowboard. Engineered for maximum control..."

Step 3: Syncing with Shopify Admin...
✅ SUCCESS: "The Complete Snowboard" has been updated live.
