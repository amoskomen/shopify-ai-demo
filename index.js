require('dotenv').config();
const cliProgress = require('cli-progress');

const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// Get the product name from the command line
const args = process.argv.slice(2);
const targetProductName = args.join(' ');

async function runDemo() {
    // Basic Routing: If user types --list, show inventory instead of updating
    if (args[0] === '--list') {
        return listProducts();
    }

    // Default to Snowboard if no name is provided
    const finalTarget = targetProductName || "The Complete Snowboard";

    console.log("==========================================");
    console.log(`🚀 STARTING LIVE AI DEMO: ${SHOP}`);
    console.log(`🎯 TARGETING: "${finalTarget}"`);
    console.log("==========================================\n");

    const baseUrl = SHOP.endsWith('/') ? SHOP.slice(0, -1) : SHOP;
    const endpoint = `${baseUrl}/admin/api/2026-01/graphql.json`;

    const progressBar = new cliProgress.SingleBar({
        format: '🤖 AI Processing | {bar} | {percentage}% | {value}/{total} Steps',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });

    try {
        console.log("Step 1: Connecting to Shopify Inventory...");
        
        const getProductQuery = `
          query($query: String!) {
            products(first: 1, query: $query) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        `;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
            body: JSON.stringify({ 
                query: getProductQuery,
                variables: { query: `title:'${finalTarget}'` }
            }),
        });

        const data = await response.json();
        const product = data.data?.products?.edges[0]?.node;

        if (!product) {
            console.log(`⚠️ Product "${finalTarget}" not found.`);
            console.log(`💡 Tip: Run 'node index.js --list' to see all product names.`);
            return;
        }

        console.log(`✅ Connection Established: "${product.title}"\n`);

        // 2. ANIMATED PROGRESS BAR
        progressBar.start(100, 0);
        let value = 0;
        const timer = setInterval(() => {
            value += 10;
            progressBar.update(value);
            if (value >= 100) {
                clearInterval(timer);
                progressBar.stop();
                finishUpdate(product, endpoint);
            }
        }, 50);

    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
    }
}

async function finishUpdate(product, endpoint) {
    let newDescription = "";

    // --- SMART MOCK AI LOGIC ---
    const title = product.title.toLowerCase();
    
    if (title.includes("snowboard")) {
        newDescription = `Conquer the slopes with ${product.title}. Engineered for maximum control and high-speed stability, it’s the ultimate board for both powder days and park runs.`;
    } else if (title.includes("gift card")) {
        newDescription = `Give the gift of choice with the ${product.title}. Perfect for any occasion, it allows your loved ones to pick exactly what they want from our premium collection.`;
    } else if (title.includes("ski")) {
        newDescription = `Master the mountain with ${product.title}. Precision-crafted for carved turns and effortless speed on any terrain.`;
    } else {
        newDescription = `Experience the premium quality of ${product.title}. Optimized by AI for maximum performance and style, this is the top choice for enthusiasts seeking the best in class.`;
    }
  
    console.log(`\n✨ AI Generated Content: "${newDescription}"`);
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
                    input: { id: product.id, descriptionHtml: `<strong>${newDescription}</strong>` }
                }
            }),
        });

        const updateData = await updateResponse.json();
        if (updateData.data?.productUpdate?.product) {
            console.log(`\n✅ SUCCESS: "${product.title}" has been updated live.`);
        }
    } catch (err) {
        console.error("\n❌ Update Error:", err.message);
    }
}

// HELPER FUNCTION: List all products so you don't forget the names
async function listProducts() {
    const baseUrl = SHOP.endsWith('/') ? SHOP.slice(0, -1) : SHOP;
    const endpoint = `${baseUrl}/admin/api/2026-01/graphql.json`;
    
    const listQuery = `{ products(first: 20) { edges { node { title } } } }`;
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
        body: JSON.stringify({ query: listQuery }),
    });
    
    const data = await response.json();
    console.log("\n--- CURRENT STORE INVENTORY ---");
    data.data.products.edges.forEach(edge => console.log(`• ${edge.node.title}`));
    console.log("-------------------------------\n");
}

runDemo();
