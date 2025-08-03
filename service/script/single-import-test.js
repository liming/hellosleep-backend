const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Test importing the single migrated article to local Strapi 5 server
async function testImportSingleMigrated() {
  try {
    console.log('🧪 Testing import of the single migrated article...');
    
    // Local Strapi 5 server configuration
    const LOCAL_STRAPI_URL = 'http://localhost:1337';
    const API_TOKEN = process.env.LOCAL_API_TOKEN; // Optional: for authentication
    
    // Load the single migrated article
    const singleMigratedPath = path.join(__dirname, 'single-migrated-article.json');
    
    if (!fs.existsSync(singleMigratedPath)) {
      console.error('❌ Single migrated article file not found. Please run single-migration-test first.');
      console.log('💡 Run: node script/single-migration-test.js');
      process.exit(1);
    }
    
    const singleMigratedArticles = JSON.parse(fs.readFileSync(singleMigratedPath, 'utf8'));
    console.log(`📦 Found ${singleMigratedArticles.length} article from single migration`);
    
    // Take the first (and only) article
    const testArticle = singleMigratedArticles[0];
    console.log(`📝 Testing with article: "${testArticle.data.title}"`);
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add API token if provided
    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`;
      console.log('✅ API token found and will be used');
    } else {
      console.log('⚠️  No API token found, proceeding without authentication');
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
        altId: testArticle.data.altId + '-test', // Add test suffix to avoid conflicts
        publishedAt: testArticle.data.publishedAt,
        // Note: createdAt and updatedAt will be set by Strapi
      }
    };
    
    console.log('📤 Sending single migrated article to Strapi...');
    console.log(`🔗 URL: ${LOCAL_STRAPI_URL}/api/articles`);
    console.log(`📄 Title: ${testArticle.data.title}`);
    console.log(`🆔 AltId: ${testArticle.data.altId}`);
    
    // Check if list is properly included
    const hasList = testArticle.data.body.some(block => block.type === 'list');
    console.log(`📋 List included: ${hasList ? '✅ Yes' : '❌ No'}`);
    
    if (hasList) {
      const listBlock = testArticle.data.body.find(block => block.type === 'list');
      console.log(`📋 List format: ${listBlock.format}, items: ${listBlock.children.length}`);
    }
    
    // Send POST request to create the article
    const response = await fetch(`${LOCAL_STRAPI_URL}/api/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(importData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Test import failed!`);
      console.error(`Status: ${response.status}`);
      console.error(`Error: ${errorText}`);
      process.exit(1);
    }
    
    const result = await response.json();
    
    console.log('✅ Test import successful!');
    console.log(`📄 Article imported with ID: ${result.data?.id}`);
    console.log(`📄 Article title: ${result.data?.attributes?.title}`);
    console.log(`📄 Article altId: ${result.data?.attributes?.altId}`);
    
    console.log('\n🎉 Test completed successfully!');
    console.log('💡 You can now check your Strapi admin panel to see the imported article');
    console.log('💡 URL: http://localhost:1337/admin');
    
  } catch (error) {
    console.error('❌ Test import failed:', error.message);
    process.exit(1);
  }
}

testImportSingleMigrated(); 