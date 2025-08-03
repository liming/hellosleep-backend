const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Import migrated articles to local Strapi 5 server
async function importToLocal() {
  try {
    console.log('📤 Importing migrated articles to local Strapi 5 server...');
    
    // Local Strapi 5 server configuration
    const LOCAL_STRAPI_URL = 'http://localhost:1337';
    const API_TOKEN = process.env.LOCAL_API_TOKEN; // Optional: for authentication
    
    // Load the migrated articles
    const migratedArticlesPath = path.join(__dirname, 'migrated-remote-articles.json');
    
    if (!fs.existsSync(migratedArticlesPath)) {
      console.error('❌ Migrated articles file not found. Please run migrate-remote-articles first.');
      console.log('💡 Run: npm run migrate-remote-articles');
      process.exit(1);
    }
    
    const migratedArticles = JSON.parse(fs.readFileSync(migratedArticlesPath, 'utf8'));
    console.log(`📦 Found ${migratedArticles.length} articles to import`);
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add API token if provided
    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`;
    }
    
    // Import articles one by one
    const importResults = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < migratedArticles.length; i++) {
      const article = migratedArticles[i];
      
      try {
        console.log(`📤 Importing article ${i + 1}/${migratedArticles.length}: ${article.data.title}`);
        
        // Prepare the article data for import
        const importData = {
          data: {
            title: article.data.title,
            excerpt: article.data.excerpt,
            date: article.data.date,
            like: article.data.like,
            coverUrl: article.data.coverUrl,
            body: article.data.body,
            altId: article.data.altId, // Include the altId from remote _id
            publishedAt: article.data.publishedAt,
            // Note: createdAt and updatedAt will be set by Strapi
          }
        };
        
        // Send POST request to create the article
        const response = await fetch(`${LOCAL_STRAPI_URL}/api/articles`, {
          method: 'POST',
          headers,
          body: JSON.stringify(importData),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const result = await response.json();
        
        importResults.push({
          title: article.data.title,
          status: 'success',
          id: result.data?.id,
          message: 'Imported successfully'
        });
        
        successCount++;
        console.log(`✅ Successfully imported: ${article.data.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to import "${article.data.title}":`, error.message);
        
        importResults.push({
          title: article.data.title,
          status: 'error',
          message: error.message
        });
        
        errorCount++;
      }
      
      // Add a small delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save import results
    const resultsPath = path.join(__dirname, 'import-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(importResults, null, 2));
    
    console.log(`\n📊 Import Summary:`);
    console.log(`✅ Successfully imported: ${successCount} articles`);
    console.log(`❌ Failed to import: ${errorCount} articles`);
    console.log(`📄 Import results saved to: ${resultsPath}`);
    
    if (errorCount > 0) {
      console.log('\n❌ Failed imports:');
      importResults
        .filter(result => result.status === 'error')
        .forEach(result => {
          console.log(`- ${result.title}: ${result.message}`);
        });
    }
    
    console.log('\n💡 Next steps:');
    console.log('1. Check your local Strapi admin panel at http://localhost:1337/admin');
    console.log('2. Verify the imported articles in the Content Manager');
    console.log('3. Review any failed imports in import-results.json');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.log('\n💡 Make sure your local Strapi server is running on http://localhost:1337');
    console.log('💡 Check if you need to set LOCAL_API_TOKEN environment variable');
    process.exit(1);
  }
}

// Run the import
importToLocal(); 