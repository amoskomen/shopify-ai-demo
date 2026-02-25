require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIG & KEYS ---
const SHOP = process.env.SHOPIFY_STORE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const endpoint = `https://${SHOP}/admin/api/2026-01/graphql.json`;

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// --- HELPERS ---
const getMockDescription = (title) => ({
    desc: `Experience the premium quality of ${title}. Optimized for performance and style in the 2026 season.`,
    tags: ["Premium", "New Arrival", "Quality"]
});

// --- ROUTES ---

// 1. Fetch Products for Dashboard
app.get('/api/products', async (req, res) => {
    try {
        const query = `{ products(first: 8) { edges { node { id title tags descriptionHtml images(first:1){ nodes { url } } } } } }`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
            body: JSON.stringify({ query }),
        });
        const data = await response.json();
        const products = data.data?.products?.edges?.map(e => e.node) || [];
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Shopify connection failed" });
    }
});

// 2. Multi-LLM Optimization Route (The Brain)
app.post('/api/optimize', async (req, res) => {
    const { id, title } = req.body;
    let finalAIContent = null;
    let engineUsed = "";

    console.log(`\n🤖 Agent Task: Optimize "${title}"`);

    try {
        // --- STEP 1: AI GENERATION WITH FAILOVER ---
        const prompt = `Write a premium 2-sentence SEO description and 3 tags for: ${title}. Return JSON only: {"desc": "...", "tags": ["t1", "t2", "t3"]}`;

        try {
            if (groq) {
                console.log("⚡ Trying Groq (Llama 3.3)...");
                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "llama-3.3-70b-versatile",
                    response_format: { type: "json_object" }
                });
                finalAIContent = JSON.parse(completion.choices[0].message.content);
                engineUsed = "Groq/Llama";
            } else {
                throw new Error("Groq not configured");
            }
        } catch (e) {
            console.log("⚠️ Groq Failed, failing over to Gemini...");
            if (genAI) {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(prompt + " Ensure result is strictly JSON.");
                // Clean markdown backticks if Gemini adds them
                const text = result.response.text().replace(/```json|```/g, "");
                finalAIContent = JSON.parse(text);
                engineUsed = "Gemini Flash";
            } else {
                throw new Error("No AI providers available");
            }
        }
    } catch (err) {
        console.log("❌ All LLMs failed. Using Mock Safety Logic.");
        finalAIContent = getMockDescription(title);
        engineUsed = "Mock Logic (Safe Mode)";
    }

    // --- STEP 2: SYNC TO SHOPIFY ---
    try {
        const mutation = `mutation p($input: ProductInput!) { productUpdate(input: $input) { product { id } userErrors { message } } }`;
        const shopifyRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    input: {
                        id,
                        descriptionHtml: `<p>${finalAIContent.desc}</p>`,
                        tags: finalAIContent.tags
                    }
                }
            }),
        });

        const result = await shopifyRes.json();
        console.log(`✅ Success! Engine: ${engineUsed} | Product: ${title}`);
        res.json({ success: true, engine: engineUsed, data: finalAIContent });

    } catch (err) {
        console.error("❌ Shopify Sync Error:", err.message);
        res.status(500).json({ error: "Failed to sync with Shopify" });
    }
});

app.listen(5000, () => {
    console.log(`🚀 AI Agent Backend Live | Store: ${SHOP}`);
    if (!groq && !genAI) console.log("⚠️ WARNING: No AI Keys found. Running in Mock Mode.");
});
