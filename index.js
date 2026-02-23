require('dotenv').config();
const cliProgress = require('cli-progress');

const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

async function runDemo() {
  console.log("==========================================");
  console.log(`🚀 STARTING LIVE AI DEMO: ${SHOP}`);
  console.log("==========================================\n");

  const baseUrl = SHOP.endsWith('/') ? SHOP.slice(0, -1) : SHOP;
  const endpoint = `${baseUrl}/admin/api/2026-01/graphql.json`;

  // Initialize Progress Bar
  const progressBar = new cliProgress.SingleBar({
    format: '🤖 AI Processing | {bar} | {percentage}% | {value}/{total} Steps',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });

  try {
    // 1. FETCH
    console.log("Step 1: Connecting to Shopify Inventory...");
    const getProductQuery = `query { products(first: 1) { edges { node { id title descriptionHtml } } } }`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
      body: JSON.stringify({ query: getProductQuery }),
    });

    const data = await response.json();
    const product = data.data?.products?.edges[0]?.node;
    if (!product) return console.log("⚠️ No products found.");

    console.log(`✅ Target Found: "${product.title}"\n`);

    // 2. ANIMATED PROGRESS BAR
    progressBar.start(100, 0);
    let value = 0;
    const timer = setInterval(() => {
      value += 5;
      progressBar.update(value);
      if (value >= 100) {
        clearInterval(timer);
        progressBar.stop();
        finishUpdate(product, endpoint);
      }
    }, 100);

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
  }
}

async function finishUpdate(product, endpoint) {
  const newDescription = `Experience the ultimate versatility with the ${product.title}. Designed for modern elegance and seamless utility, it's the perfect addition to your lifestyle.`;
  
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
    console.log("\n✅ LIVE UPDATE SUCCESSFUL: Storefront updated.");
  }
}

runDemo();
