require('dotenv').config();

const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

async function runDemo() {
  console.log("==========================================");
  console.log(`🚀 CONNECTING TO: ${SHOP}`);
  console.log("==========================================\n");

  // Ensure the URL is clean
  const baseUrl = SHOP.endsWith('/') ? SHOP.slice(0, -1) : SHOP;
  const endpoint = `${baseUrl}/admin/api/2024-01/graphql.json`;

  const query = `
    query {
      products(first: 1) {
        edges {
          node {
            id
            title
            descriptionHtml
          }
        }
      }
    }
  `;

  try {
    console.log("Step 1: Fetching Product from Shopify Admin API...");
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const product = data.data?.products?.edges[0]?.node;

    if (product) {
      console.log(`✅ SUCCESS: Found Product - "${product.title}"`);
      console.log(`📝 Original Description: ${product.descriptionHtml || 'Empty'}`);
      console.log("\nStep 2: Sending to OpenAI for optimization...");
      // For this demo, we'll log the intention
      console.log("💡 [Demo Logic]: Passing to GPT-4o-mini for SEO rewrite...");
    } else {
      console.log("⚠️ No products found in this store.");
    }

  } catch (error) {
    console.error("\n❌ CRITICAL ERROR:", error.message);
    if (error.message.includes('fetch failed')) {
      console.log("👉 Tip: Check if your .env URL starts with https:// and has no spaces.");
    }
  }
}

runDemo();
