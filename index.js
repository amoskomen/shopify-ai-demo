require('dotenv').config();
const cliProgress = require('cli-progress');
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Keys
const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const GROQ_KEY = process.env.GROQ_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// Initialize AI Clients
const groq = GROQ_KEY ? new Groq({ apiKey: GROQ_KEY }) : null;
const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

const args = process.argv.slice(2);
const targetProductName = args.filter(a => !a.startsWith('--')).join(' ');

async function runDemo() {
    if (args.includes('--list')) return listProducts();

    const finalTarget = targetProductName || "Gift Card";
    const baseUrl = SHOP.replace(/^https?:\/\//, "").trim();
    const endpoint = `https://${baseUrl}/admin/api/2026-01/graphql.json`;

    console.log("==========================================");
    console.log(`🚀 STARTING MULTI-LLM AGENT: ${SHOP}`);
    console.log(`🎯 TARGETING: "${finalTarget}"`);
    console.log("==========================================\n");

    const progressBar = new cliProgress.SingleBar({
        format: '🤖 AI Brain Thinking ({engine}) | {bar} | {percentage}%',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });

    try {
        // --- STEP 1: FETCH ---
        console.log("Step 1: Connecting to Shopify Inventory...");
        const getProductQuery = `query($query: String!) { products(first: 1, query: $query) { edges { node { id title descriptionHtml } } } }`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
            body: JSON.stringify({ query: getProductQuery, variables: { query: `title:'${finalTarget}'` } }),
        });

        const data = await response.json();
        const product = data.data?.products?.edges[0]?.node;

        if (!product) {
            console.log(`⚠️ Product "${finalTarget}" not found.`);
            return;
        }

        console.log(`✅ Connection Established: "${product.title}"\n`);
        
        // --- STEP 2: AI GENERATION WITH FAILOVER ---
        let finalAIContent = "";
        let engineUsed = "Groq/Llama";

        progressBar.start(100, 0, { engine: engineUsed });

        try {
            if (groq) {
                // Try Groq First (Fastest)
                const completion = await groq.chat.completions.create({
                    messages: [{ role: "user", content: `Write a 2-sentence SEO description for ${product.title}. No conversational filler.` }],
                    model: "llama-3.3-70b-versatile",
                });
                finalAIContent = completion.choices[0].message.content;
            } else if (genAI) {
                // Try Gemini Second
                engineUsed = "Gemini";
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(`Write a 2-sentence description for ${product.title}`);
                finalAIContent = result.response.text();
            } else {
                throw new Error("No AI Keys");
            }
        } catch (e) {
            engineUsed = "Mock Logic";
            finalAIContent = getMockDescription(product.title);
        }

        // Animated UI
        for (let i = 0; i <= 100; i += 25) {
            progressBar.update(i, { engine: engineUsed });
            await new Promise(r => setTimeout(r, 100));
        }
        progressBar.stop();

        // --- STEP 3: UPDATE ---
        await finishUpdate(product, endpoint, TOKEN, finalAIContent);

    } catch (error) {
        console.error("\n❌ GLOBAL ERROR:", error.message);
    }
}

function getMockDescription(title) {
    return `Experience the premium quality of ${title}. Optimized for performance and style.`;
}

async function finishUpdate(product, endpoint, token, content) {
    console.log(`\n✨ CONTENT READY: "${content.trim()}"`);
    console.log(`Step 3: Syncing with Shopify Admin...`);

    const updateMutation = `mutation productUpdate($input: ProductInput!) { productUpdate(input: $input) { product { id } userErrors { message } } }`;
    const updateResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
            query: updateMutation,
            variables: { input: { id: product.id, descriptionHtml: `<p>${content.trim()}</p>` } }
        }),
    });

    const updateData = await updateResponse.json();
    if (updateData.data?.productUpdate?.product) {
        console.log(`✅ SUCCESS: "${product.title}" updated live.`);
    } else {
        console.log("\n❌ Shopify Update Failed.");
    }
}

async function listProducts() {
    const rawUrl = SHOP.replace(/^https?:\/\//, "").trim();
    const endpoint = `https://${rawUrl}/admin/api/2026-01/graphql.json`;
    const listQuery = `{ products(first: 20) { edges { node { title } } } }`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
            body: JSON.stringify({ query: listQuery }),
        });
        const data = await response.json();
        console.log("\n--- CURRENT STORE INVENTORY ---");
        data.data.products.edges.forEach(edge => console.log(`• ${edge.node.title}`));
    } catch (e) { console.log("❌ List Error:", e.message); }
}

runDemo();
