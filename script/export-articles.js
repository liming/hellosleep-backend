const fs = require('fs');
const path = require('path');

// Strapi configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN; // Optional: for private content

async function exportArticles() {
  try {
    console.log('Exporting articles from Strapi...');
    
    // Build the API URL
    const apiUrl = `${STRAPI_URL}/api/articles`;
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add API token if provided
    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`;
    }
    
    // Fetch articles
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save to file
    const outputPath = path.join(__dirname, 'articles-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Successfully exported ${data.data?.length || 0} articles to ${outputPath}`);
    console.log('📄 File contains the full article data including body blocks');
    
    // Also create a simplified version for easier viewing
    const simplifiedArticles = data.data?.map(article => ({
      id: article.id,
      title: article.attributes.title,
      excerpt: article.attributes.excerpt,
      date: article.attributes.date,
      altId: article.attributes.altId,
      body: article.attributes.body,
      createdAt: article.attributes.createdAt,
      updatedAt: article.attributes.updatedAt,
      publishedAt: article.attributes.publishedAt,
    })) || [];
    
    const simplifiedPath = path.join(__dirname, 'articles-simplified.json');
    fs.writeFileSync(simplifiedPath, JSON.stringify(simplifiedArticles, null, 2));
    
    console.log(`📝 Simplified version saved to ${simplifiedPath}`);
    
  } catch (error) {
    console.error('❌ Error exporting articles:', error.message);
    process.exit(1);
  }
}

// Run the export
exportArticles(); 