const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configuration: use STRAPI_URL to import to production (e.g. Railway)
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
// When targeting production, prefer STRAPI_API_TOKEN so .env LOCAL_API_TOKEN doesn't override
const API_TOKEN = process.env.STRAPI_URL
  ? (process.env.STRAPI_API_TOKEN || process.env.STRAPI_TOKEN || process.env.LOCAL_API_TOKEN)
  : (process.env.LOCAL_API_TOKEN || process.env.STRAPI_API_TOKEN || process.env.STRAPI_TOKEN || 'your-api-token-here');

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

// Fetch existing categories from Strapi
async function fetchExistingCategories() {
  console.log('📂 Fetching existing categories from Strapi...');
  
  try {
    const response = await makeApiRequest('/categories');
    const categoryKeyToDocumentIdMapping = new Map();
    
    response.data.forEach(category => {
      const key = category.key;
      const documentId = category.documentId;
      categoryKeyToDocumentIdMapping.set(key, documentId);
      console.log(`📂 Found existing category: ${category.name} (DocumentID: ${documentId}, Key: ${key})`);
    });
    
    console.log(`✅ Found ${categoryKeyToDocumentIdMapping.size} existing categories.`);
    return categoryKeyToDocumentIdMapping;
  } catch (error) {
    console.error('❌ Failed to fetch existing categories:', error.message);
    return new Map();
  }
}

// Import categories first
async function importCategories() {
  console.log('📂 Starting category import...');
  
  const categoriesPath = path.join(__dirname, 'migrated-categories.json');
  if (!fs.existsSync(categoriesPath)) {
    console.error('❌ Categories file not found. Please run the migration first.');
    return new Map();
  }
  
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  console.log(`📦 Found ${categories.length} categories to import`);
  
  const categoryKeyToDocumentIdMapping = new Map(); // Maps category key to Strapi documentId
  
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    console.log(`🔄 Importing category ${i + 1}/${categories.length}: ${category.data.name}`);
    
    try {
      // Prepare category data without timestamps
      const categoryData = {
        data: {
          name: category.data.name,
          description: category.data.description,
          weight: category.data.weight,
          key: category.data.key
        }
      };
      
      const result = await makeApiRequest('/categories', 'POST', categoryData);
      const newDocumentId = result.data.documentId;
      const categoryKey = category.data.key;
      
      categoryKeyToDocumentIdMapping.set(categoryKey, newDocumentId);
      console.log(`✅ Category imported with DocumentID: ${newDocumentId} (Key: ${categoryKey})`);
      
      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to import category "${category.data.name}":`, error.message);
    }
  }
  
  console.log(`✅ Category import completed. ${categoryKeyToDocumentIdMapping.size} categories imported.`);
  return categoryKeyToDocumentIdMapping;
}

// Import articles with category relations
async function importArticles(categoryKeyToDocumentIdMapping) {
  console.log('📄 Starting article import...');
  
  const articlesPath = path.join(__dirname, 'migrated-remote-articles-improved.json');
  if (!fs.existsSync(articlesPath)) {
    console.error('❌ Articles file not found. Please run the migration first.');
    return;
  }
  
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  console.log(`📦 Found ${articles.length} articles to import`);
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`🔄 Importing article ${i + 1}/${articles.length}: ${article.data.title}`);
    
    try {
      // Prepare article data for import
      const articleData = { ...article.data };
      
      // Handle category relation (using key to find documentId)
      if (articleData.category) {
        const categoryKey = articleData.category;
        if (categoryKeyToDocumentIdMapping.has(categoryKey)) {
          const categoryDocumentId = categoryKeyToDocumentIdMapping.get(categoryKey);
          articleData.category = categoryDocumentId;
          console.log(`📂 Linking article to category DocumentID: ${categoryDocumentId} (Key: ${categoryKey})`);
        } else {
          console.log(`⚠️  Category key not found in mapping: ${categoryKey}`);
          delete articleData.category;
        }
      } else {
        // Remove category if not found
        delete articleData.category;
      }
      
      // Remove fields that shouldn't be sent to API
      delete articleData.publishedAt;
      delete articleData.createdAt;
      delete articleData.updatedAt;
      
      const result = await makeApiRequest('/articles', 'POST', { data: articleData });
      
      console.log(`✅ Article imported with ID: ${result.data.id}`);
      results.success++;
      
      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Failed to import article "${article.data.title}":`, error.message);
      results.failed++;
      results.errors.push({
        title: article.data.title,
        error: error.message
      });
    }
  }
  
  // Save import results
  const resultsPath = path.join(__dirname, 'import-results-improved.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  console.log('\n📊 Import Results:');
  console.log(`✅ Successfully imported: ${results.success} articles`);
  console.log(`❌ Failed to import: ${results.failed} articles`);
  console.log(`📄 Results saved to: ${resultsPath}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Import Errors:');
    results.errors.forEach(error => {
      console.log(`- "${error.title}": ${error.error}`);
    });
  }
  
  return results;
}

// Main import function
async function runImport() {
  try {
    console.log('🚀 Starting improved import process...');
    console.log(`🔗 Strapi URL: ${STRAPI_URL}`);
    console.log(`🔑 API Token: ${API_TOKEN ? 'Set' : 'Not set'}`);
    
    if (!API_TOKEN || API_TOKEN === 'your-api-token-here') {
      console.error('❌ Please set STRAPI_API_TOKEN environment variable');
      console.log('💡 Example: STRAPI_API_TOKEN=your-token node improved-import.js');
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
    
    // Check command line argument
    const args = process.argv.slice(2);
    const importType = args[0];
    
    if (importType === 'categories') {
      // Import only categories
      console.log('📂 Running categories import only...');
      const categoryKeyToIdMapping = await importCategories();
      console.log('\n🎉 Categories import completed!');
      return categoryKeyToIdMapping;
    } else {
      // Use existing categories, then import articles
      console.log('📂 Running articles import with existing categories...');
      const categoryKeyToDocumentIdMapping = await fetchExistingCategories();
      await importArticles(categoryKeyToDocumentIdMapping);
      console.log('\n🎉 Import process completed!');
    }
    
  } catch (error) {
    console.error('❌ Import process failed:', error.message);
    process.exit(1);
  }
}

// Run the import
runImport(); 