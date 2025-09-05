// Quick script to find products with "One Size" options
async function findOneSizeProducts() {
  try {
    // Get all products
    const response = await fetch('http://localhost:3000/api/printify/products');
    const products = await response.json();
    
    console.log(`🔍 Checking ${products.length} products for "One Size" options...`);
    
    for (const product of products) {
      console.log(`\n📦 Checking product: ${product.title} (ID: ${product.id})`);
      
      // Get detailed product data
      const detailResponse = await fetch(`http://localhost:3000/api/printify/product/${product.id}`);
      const detailData = await detailResponse.json();
      
      if (detailData.options) {
        detailData.options.forEach((option, optIndex) => {
          option.values.forEach((value, valIndex) => {
            const valueText = value.title || value;
            if (valueText.toLowerCase().includes('one size')) {
              console.log(`🎯 FOUND ONE SIZE: "${valueText}" in option ${optIndex} (${option.name})`);
            }
          });
        });
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n✅ Product scan complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the function
findOneSizeProducts();
