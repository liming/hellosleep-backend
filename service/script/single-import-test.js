const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Function to fetch category IDs from Strapi
async function fetchCategoryIds(STRAPI_URL, API_TOKEN) {
  try {
    console.log('🔍 Fetching category IDs from Strapi...');
    const response = await fetch(`${STRAPI_URL}/api/categories?populate=*`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const categoryKeyToIdMapping = new Map();
    
    data.data.forEach(category => {
      const key = category.key;
      const id = category.id;
      categoryKeyToIdMapping.set(key, id);
      console.log(`📂 Found category: ${category.name} (ID: ${id}, Key: ${key})`);
    });
    
    return categoryKeyToIdMapping;
  } catch (error) {
    console.error('❌ Failed to fetch category IDs:', error.message);
    return new Map();
  }
}

// Test importing the single migrated article to local Strapi server
async function testImportSingleMigrated() {
  try {
    console.log('🧪 Testing import of the single migrated article...');
    
    // Local Strapi server configuration
    const STRAPI_URL = 'http://localhost:1337';
    const API_TOKEN = process.env.LOCAL_API_TOKEN || process.env.STRAPI_API_TOKEN || process.env.STRAPI_TOKEN;
    
    // Load the single migrated article
    const singleMigratedPath = path.join(__dirname, 'single-migrated-article.json');
    
    if (!fs.existsSync(singleMigratedPath)) {
      console.error('❌ Single migrated article file not found. Please run single-migration-test first.');
      console.log('💡 Run: node single-migration-test.js');
      process.exit(1);
    }
    
    const singleMigratedArticles = JSON.parse(fs.readFileSync(singleMigratedPath, 'utf8'));
    console.log(`📦 Found ${singleMigratedArticles.length} article from single migration`);
    
    // Take the first (and only) article
    const testArticle = singleMigratedArticles[0];
    console.log(`📝 Testing with article: "${testArticle.data.title}"`);
    
    // Helper function to make API requests
    async function makeApiRequest(endpoint, method = 'GET', data = null) {
      const url = `${STRAPI_URL}/api${endpoint}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return await response.json();
      } catch (error) {
        throw new Error(`Network error: ${error.message}`);
      }
    }
    
    console.log(`🔗 Strapi URL: ${STRAPI_URL}`);
    console.log(`🔑 API Token: ${API_TOKEN ? 'Set' : 'Not set'}`);

    if (!API_TOKEN || API_TOKEN === 'your-api-token-here') {
      console.error('❌ Please set LOCAL_API_TOKEN environment variable');
      console.log('💡 Check your .env file and ensure LOCAL_API_TOKEN is set');
      process.exit(1);
    }

    // Test connection
    console.log('🔍 Testing connection to Strapi...');
    try {
      await makeApiRequest('/articles');
      console.log('✅ Connection successful');
    } catch (error) {
      console.error('❌ Failed to connect to Strapi:', error.message);
      console.log('💡 Make sure Strapi is running and the API token is correct');
      process.exit(1);
    }
    
    // Fetch category IDs for mapping
    const categoryKeyToIdMapping = await fetchCategoryIds(STRAPI_URL, API_TOKEN);
    
    // Handle category mapping (key to ID)
    let categoryId = null;
    if (testArticle.data.category) {
      const categoryKey = testArticle.data.category;
      if (categoryKeyToIdMapping.has(categoryKey)) {
        categoryId = categoryKeyToIdMapping.get(categoryKey);
        console.log(`📂 Mapped category key "${categoryKey}" to ID: ${categoryId}`);
      } else {
        console.log(`⚠️  Category key "${categoryKey}" not found in Strapi`);
      }
    }
    
    // Prepare the article data for import
    const importData = {
      data: {
        title: testArticle.data.title + '-test',
        excerpt: testArticle.data.excerpt,
        date: testArticle.data.date,
        like: testArticle.data.like,
        coverUrl: testArticle.data.coverUrl,
        body: testArticle.data.body,
        altId: testArticle.data.altId + '-test-' + Date.now(), // Add timestamp to avoid conflicts
        type: testArticle.data.type || 'tutorial',
        // Include category if mapped
        ...(categoryId && { category: categoryId }),
        // Include sharing component if it exists
        ...(testArticle.data.sharing && { sharing: testArticle.data.sharing }),
        // Note: createdAt and updatedAt will be set by Strapi
      }
    };
    
    console.log('📤 Sending single migrated article to Strapi...');
    console.log(`🔗 URL: ${STRAPI_URL}/api/articles`);
    console.log(`📄 Title: ${testArticle.data.title}`);
    console.log(`🆔 AltId: ${testArticle.data.altId}`);
    console.log(`📁 Type: ${testArticle.data.type || 'tutorial'}`);
    console.log(`🤝 Sharing: ${testArticle.data.sharing ? '✅ Yes' : '❌ No'}`);
    if (testArticle.data.sharing) {
      console.log(`   Contributor: ${testArticle.data.sharing.contributor}`);
      console.log(`   UserLink: ${testArticle.data.sharing.userLink || 'None'}`);
    }
    console.log(`📂 Category: ${testArticle.data.category ? '✅ Yes (Key: ' + testArticle.data.category + ')' : '❌ No'}`);
    
    // Analyze content structure
    const hasImages = testArticle.data.body.some(block => block.type === 'image');
    const hasList = testArticle.data.body.some(block => block.type === 'list');
    const hasHeadings = testArticle.data.body.some(block => block.type === 'heading');
    const hasQuotes = testArticle.data.body.some(block => block.type === 'quote');
    
    console.log(`🖼️  Images: ${hasImages ? '✅ Yes' : '❌ No'}`);
    console.log(`📋 Lists: ${hasList ? '✅ Yes' : '❌ No'}`);
    console.log(`📝 Headings: ${hasHeadings ? '✅ Yes' : '❌ No'}`);
    console.log(`💬 Quotes: ${hasQuotes ? '✅ Yes' : '❌ No'}`);
    
    if (hasList) {
      const listBlocks = testArticle.data.body.filter(block => block.type === 'list');
      listBlocks.forEach((listBlock, index) => {
        console.log(`📋 List ${index + 1}: ${listBlock.listType || listBlock.format}, items: ${listBlock.children.length}`);
      });
    }
    
    if (hasImages) {
      const imageBlocks = testArticle.data.body.filter(block => block.type === 'image');
      console.log(`🖼️  Found ${imageBlocks.length} image(s)`);
      imageBlocks.forEach((imageBlock, index) => {
        console.log(`  Image ${index + 1}: ${imageBlock.image?.name || 'unnamed'}`);
      });
    }
    
    // Show a sample of the body structure
    console.log('\n📄 Body structure preview:');
    testArticle.data.body.slice(0, 3).forEach((block, index) => {
      console.log(`  ${index + 1}. ${block.type} - ${block.children?.length || 0} children`);
    });
    
    // Send POST request to create the article
    try {
      console.log('\n🚀 Importing article...');
      const result = await makeApiRequest('/articles', 'POST', importData);
      
      console.log('✅ Test import successful!');
      console.log(`📄 Article imported with ID: ${result.data?.id}`);
      console.log(`📄 Article title: ${result.data?.title || result.data?.attributes?.title}`);
      console.log(`📄 Article altId: ${result.data?.altId || result.data?.attributes?.altId}`);
      console.log(`📁 Article type: ${result.data?.type || result.data?.attributes?.type}`);
      
      console.log('\n🎉 Test completed successfully!');
      console.log('💡 You can now check your Strapi admin panel to see the imported article');
      console.log('💡 URL: http://localhost:1337/admin');
      
    } catch (error) {
      console.error(`❌ Test import failed!`);
      console.error(`Error: ${error.message}`);
      
      // Try to parse validation errors
      if (error.message.includes('ValidationError')) {
        console.log('\n🔍 Validation errors detected. This usually means:');
        console.log('  - Missing required fields in body blocks');
        console.log('  - Incorrect format values for text nodes');
        console.log('  - Invalid image structure');
        console.log('  - Empty children arrays in blocks');
        
        // Show first few body blocks for debugging
        console.log('\n📋 First few body blocks for debugging:');
        testArticle.data.body.slice(0, 5).forEach((block, index) => {
          console.log(`Block ${index}:`, JSON.stringify(block, null, 2));
        });
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Test import failed:', error.message);
    process.exit(1);
  }
}

testImportSingleMigrated(); 