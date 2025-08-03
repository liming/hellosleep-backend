const fs = require('fs');
const path = require('path');

// Simple export script using Strapi's REST API
// This script can be run independently

async function exportArticles() {
  try {
    console.log('Exporting articles from Strapi API...');
    
    // Configuration
    const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
    const API_TOKEN = process.env.STRAPI_API_TOKEN;
    
    // Build the API URL with pagination
    const apiUrl = `${STRAPI_URL}/api/articles?pagination[pageSize]=100&populate=*`;
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`;
    }
    
    console.log(`Fetching from: ${apiUrl}`);
    
    // Fetch articles
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Save full export
    const outputPath = path.join(__dirname, 'articles-api-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Successfully exported ${data.data?.length || 0} articles to ${outputPath}`);
    
    // Create a simplified version
    const simplifiedArticles = data.data?.map(article => ({
      id: article.id,
      title: article.attributes.title,
      excerpt: article.attributes.excerpt,
      date: article.attributes.date,
      altId: article.attributes.altId,
      body: article.attributes.body,
      coverUrl: article.attributes.coverUrl,
      originUrl: article.attributes.originUrl,
      like: article.attributes.like,
      sharing: article.attributes.sharing,
      createdAt: article.attributes.createdAt,
      updatedAt: article.attributes.updatedAt,
      publishedAt: article.attributes.publishedAt,
    })) || [];
    
    const simplifiedPath = path.join(__dirname, 'articles-api-simplified.json');
    fs.writeFileSync(simplifiedPath, JSON.stringify(simplifiedArticles, null, 2));
    
    console.log(`📝 Simplified version saved to ${simplifiedPath}`);
    
    // Show sample of body content
    if (simplifiedArticles.length > 0) {
      console.log('\n📄 Sample body content structure:');
      console.log(JSON.stringify(simplifiedArticles[0].body, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error exporting articles:', error.message);
    console.log('\n💡 Make sure your Strapi server is running on http://localhost:1337');
    console.log('💡 Or set STRAPI_URL environment variable to your server URL');
    process.exit(1);
  }
}

// Run the export
exportArticles(); 