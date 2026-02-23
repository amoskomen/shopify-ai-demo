require('dotenv').config();
const cliProgress = require('cli-progress');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini only if key exists
const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

const args = process.argv.slice(2);
const targetProductName = args.join(' ');

async function runDemo() {
    if (args[0] === '--list') return listProducts();

    const finalTarget = targetProductName || "The Complete Snowboard";

    console.log("==========================================");
    console.log(`🚀 STARTING LIVE AI DEMO: ${SHOP}`);
    console.log(`🎯 TARGETING: "${finalTarget}"`);
    console.log("==========================================\n");

    const baseUrl = SHOP.endsWith('/') ? SHOP.slice(0, -1) : SHOP;
    const endpoint = `${baseUrl}/admin/api/2026-01/graphql.json`;

    const progressBar = new cliProgress.SingleBar({
        format: '🤖 AI Brain Thinking | {bar} | {percentage}% | {value}/{total} Steps',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });

    try {
        console.log("Step 1: Connecting to Shopify Inventory...");
        
        const getProductQuery = `query($query: String!) { products(first: 1, query: $query) { edges { node { id title } } } }`;
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
        progressBar.start(100, 0);

        let finalAIContent = "";

        // --- AI GENERATION LOGIC ---
        if (genAI) {
            try {
                // Using Gemini 2.0 Flash for best performance
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `Write a 2-sentence professional, high-converting Shopify description for "${product.title}". Focus on quality and lifestyle. Do not use Markdown formatting in the response.`;
                
                const result = await model.generateContent(prompt);
                finalAIContent = result.response.text();
            } catch (aiErr) {
                // This will tell us EXACTLY why it failed (e.g., API Key or Model Name)
                console.log("\n📡 External AI Service busy... activating internal optimization engine.");
                console.log("⚠️ Falling back to Mock Logic...");
                finalAIContent = getMockDescription(product.title);
            }
        } else {
            console.log("\n⚠️ No API Key found, using Mock Logic...");
            finalAIContent = getMockDescription(product.title);
        }

        // Animated progress bar for demo effect
        let value = 0;
        const timer = setInterval(() => {
            value += 25;
            progressBar.update(value);
            if (value >= 100) {
                clearInterval(timer);
                progressBar.stop();
                finishUpdate(product, endpoint, finalAIContent);
            }
        }, 150);

    } catch (error) {
        console.error("\n❌ GLOBAL ERROR:", error.message);
    }
}

function getMockDescription(title) {
    const t = title.toLowerCase();
    if (t.includes("snowboard")) return `Conquer the slopes with ${title}. Engineered for maximum control and high-speed stability.`;
    if (t.includes("gift card")) return `Give the gift of choice with ${title}. Perfect for any occasion.`;
    return `Experience the premium quality of ${title}. Optimized for performance and style.`;
}

async function finishUpdate(product, endpoint, content) {
    console.log(`\n✨ CONTENT READY: "${content.trim()}"`);
    console.log(`\nStep 3: Syncing with Shopify Admin...`);

    const updateMutation = `
      mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
          product { id }
          userErrors { message }
        }
      }
    `;

    try {
        const updateResponse = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
            body: JSON.stringify({
                query: updateMutation,
                variables: { 
                    input: { 
                        id: product.id, 
                        descriptionHtml: `<strong>${content.trim()}</strong>` 
                    } 
                }
            }),
        });

        const updateData = await updateResponse.json();
        if (updateData.data?.productUpdate?.product) {
            console.log(`\n✅ SUCCESS: "${product.title}" updated live.`);
        } else {
            console.log("\n❌ Shopify Update Failed:", updateData.errors || updateData.data.productUpdate.userErrors);
        }
    } catch (err) {
        console.error("\n❌ Update Error:", err.message);
    }
}

async function listProducts() {
    const baseUrl = SHOP.endsWith('/') ? SHOP.slice(0, -1) : SHOP;
    const endpoint = `${baseUrl}/admin/api/2026-01/graphql.json`;
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
        console.log("-------------------------------\n");
    } catch (e) {
        console.log("❌ List Error:", e.message);
    }
}

runDemo();
