const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Function to fetch category documentIds from Strapi
async function fetchCategoryDocumentIds(STRAPI_URL, API_TOKEN) {
  try {
    console.log('🔍 Fetching category documentIds from Strapi...');
    const response = await fetch(`${STRAPI_URL}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const categoryKeyToDocumentIdMapping = new Map();
    
    data.data.forEach(category => {
      const key = category.key;
      const documentId = category.documentId;
      categoryKeyToDocumentIdMapping.set(key, documentId);
      console.log(`📂 Found category: ${category.name} (DocumentID: ${documentId}, Key: ${key})`);
    });
    
    return categoryKeyToDocumentIdMapping;
  } catch (error) {
    console.error('❌ Failed to fetch category documentIds:', error.message);
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
    
    // Load the migrated articles and find a tutorial
    const migratedPath = path.join(__dirname, 'migrated-remote-articles-improved.json');
    
    if (!fs.existsSync(migratedPath)) {
      console.error('❌ Migrated articles file not found. Please run improved-migration first.');
      console.log('💡 Run: node improved-migration.js');
      process.exit(1);
    }
    
    const migratedArticles = JSON.parse(fs.readFileSync(migratedPath, 'utf8'));
    console.log(`📦 Found ${migratedArticles.length} migrated articles`);
    
    // Find a tutorial article with category
    const tutorialArticle = migratedArticles.find(article => 
      article.data.type === 'tutorial' && article.data.category
    );
    
    if (!tutorialArticle) {
      console.error('❌ No tutorial article with category found in migrated data.');
      console.log('💡 Please ensure you have tutorial articles with categories in your migrated data.');
      process.exit(1);
    }
    
    console.log(`📝 Testing with tutorial: "${tutorialArticle.data.title}"`);
    console.log(`📂 Category: ${tutorialArticle.data.category}`);
    console.log(`📄 Type: ${tutorialArticle.data.type}`);
    
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
    
    // Fetch category documentIds for mapping
    const categoryKeyToDocumentIdMapping = await fetchCategoryDocumentIds(STRAPI_URL, API_TOKEN);
    
    // Handle category mapping (key to documentId)
    let categoryDocumentId = null;
    if (tutorialArticle.data.category) {
      const categoryKey = tutorialArticle.data.category;
      if (categoryKeyToDocumentIdMapping.has(categoryKey)) {
        categoryDocumentId = categoryKeyToDocumentIdMapping.get(categoryKey);
        console.log(`📂 Mapped category key "${categoryKey}" to DocumentID: ${categoryDocumentId}`);
      } else {
        console.log(`⚠️  Category key "${categoryKey}" not found in Strapi`);
      }
    }
    
    // Prepare the article data for import
    const importData = {
      data: {
        title: tutorialArticle.data.title + '-test',
        excerpt: tutorialArticle.data.excerpt,
        date: tutorialArticle.data.date,
        like: tutorialArticle.data.like,
        coverUrl: tutorialArticle.data.coverUrl,
        body: tutorialArticle.data.body,
        altId: tutorialArticle.data.altId + '-test-' + Date.now(), // Add timestamp to avoid conflicts
        type: tutorialArticle.data.type || 'tutorial',
        // Include category if mapped
        ...(categoryDocumentId && { category: categoryDocumentId }),
        // Include sharing component if it exists
        ...(tutorialArticle.data.sharing && { sharing: tutorialArticle.data.sharing }),
        // Note: createdAt and updatedAt will be set by Strapi
      }
    };
    
    console.log('📤 Sending tutorial article to Strapi...');
    console.log(`🔗 URL: ${STRAPI_URL}/api/articles`);
    console.log(`📄 Title: ${tutorialArticle.data.title}`);
    console.log(`🆔 AltId: ${tutorialArticle.data.altId}`);
    console.log(`📁 Type: ${tutorialArticle.data.type || 'tutorial'}`);
    console.log(`🤝 Sharing: ${tutorialArticle.data.sharing ? '✅ Yes' : '❌ No'}`);
    if (tutorialArticle.data.sharing) {
      console.log(`   Contributor: ${tutorialArticle.data.sharing.contributor}`);
      console.log(`   UserLink: ${tutorialArticle.data.sharing.userLink || 'None'}`);
    }
    console.log(`📂 Category: ${tutorialArticle.data.category ? '✅ Yes (Key: ' + tutorialArticle.data.category + ')' : '❌ No'}`);
    
    // Analyze content structure
    const hasImages = tutorialArticle.data.body.some(block => block.type === 'image');
    const hasList = tutorialArticle.data.body.some(block => block.type === 'list');
    const hasHeadings = tutorialArticle.data.body.some(block => block.type === 'heading');
    const hasQuotes = tutorialArticle.data.body.some(block => block.type === 'quote');
    
    console.log(`🖼️  Images: ${hasImages ? '✅ Yes' : '❌ No'}`);
    console.log(`📋 Lists: ${hasList ? '✅ Yes' : '❌ No'}`);
    console.log(`📝 Headings: ${hasHeadings ? '✅ Yes' : '❌ No'}`);
    console.log(`💬 Quotes: ${hasQuotes ? '✅ Yes' : '❌ No'}`);
    
    if (hasList) {
      const listBlocks = tutorialArticle.data.body.filter(block => block.type === 'list');
      listBlocks.forEach((listBlock, index) => {
        console.log(`📋 List ${index + 1}: ${listBlock.listType || listBlock.format}, items: ${listBlock.children.length}`);
      });
    }
    
    if (hasImages) {
      const imageBlocks = tutorialArticle.data.body.filter(block => block.type === 'image');
      console.log(`🖼️  Found ${imageBlocks.length} image(s)`);
      imageBlocks.forEach((imageBlock, index) => {
        console.log(`  Image ${index + 1}: ${imageBlock.image?.name || 'unnamed'}`);
      });
    }
    
    // Show a sample of the body structure
    console.log('\n📄 Body structure preview:');
    tutorialArticle.data.body.slice(0, 3).forEach((block, index) => {
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
        tutorialArticle.data.body.slice(0, 5).forEach((block, index) => {
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