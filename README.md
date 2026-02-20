# Shopify AI Product Description Generator

A Node.js proof-of-concept that demonstrates how to integrate the **Shopify GraphQL Admin API** with **OpenAI's GPT models** to automate e-commerce copywriting.

## 🚀 Features
- **GraphQL Integration**: Connects to Shopify Admin API to fetch live product data.
- **AI Logic**: Generates SEO-optimized, punchy product descriptions using OpenAI.
- **Resilient Design**: Includes a "Graceful Fallback" system. If the AI API is unavailable or reaches a quota limit, the system provides a smart-mocked description to ensure the merchant's workflow is never interrupted.

## 🛠️ Tech Stack
- **Runtime**: Node.js v22
- **APIs**: Shopify GraphQL Admin API, OpenAI API
- **Utilities**: Dotenv (Security), Fetch API

## ⚙️ Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file based on the `.env.example` provided.
4. Run `node index.js`.

## 📸 Demo Execution
```text
Step 1: Fetching Product from Shopify Admin API...
✅ SUCCESS: Found Product - "Gift Card"

Step 2: Generating AI Description...
💡 [Note: Using Local AI Logic - API Quota Reached]
------------------------------------------
FINAL AI OUTPUT:
Unlock the full potential of your Gift Card! Designed for quality and style...
