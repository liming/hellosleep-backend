const fs = require('fs');
const path = require('path');

// Export articles from remote Strapi 3 server
async function exportArticlesFromRemote() {
  try {
    console.log('📡 Exporting articles from remote Strapi 3 server...');
    
    // Remote Strapi 3 server configuration
    const REMOTE_STRAPI_URL = 'http://hellosleep.net:1337';
    const API_TOKEN = process.env.REMOTE_API_TOKEN; // Optional: for private content
    
    // Build the API URL for articles (Strapi 3 format)
    const apiUrl = `${REMOTE_STRAPI_URL}/articles`;
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add API token if provided
    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`;
    }
    
    console.log(`🔗 Fetching from: ${apiUrl}`);
    
    // Fetch all articles at once (no pagination)
    console.log('📄 Fetching all articles...');
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format from server');
    }
    
    console.log(`\n✅ Successfully exported ${data.length} articles from remote server`);
    
    // Save full export
    const outputPath = path.join(__dirname, 'remote-articles-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`📄 Full export saved to: ${outputPath}`);
    
    // Create a simplified version for easier viewing
    const simplifiedArticles = data.map(article => ({
      id: article._id || article.id,
      title: article.title,
      excerpt: article.excerpt,
      body: article.body, // This is the Markdown content
      like: article.like,
      coverUrl: article.coverUrl,
      date: article.date,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      publishedAt: article.publishedAt,
      type: article.type,
      kind: article.kind,
      author: article.author,
      category: article.category
    }));
    
    const simplifiedPath = path.join(__dirname, 'remote-articles-simplified.json');
    fs.writeFileSync(simplifiedPath, JSON.stringify(simplifiedArticles, null, 2));
    
    console.log(`📝 Simplified version saved to: ${simplifiedPath}`);
    
    // Show sample of body content
    if (simplifiedArticles.length > 0) {
      console.log('\n📄 Sample body content (Markdown):');
      console.log(simplifiedArticles[0].body?.substring(0, 200) + '...');
    }
    
    return simplifiedArticles;
    
  } catch (error) {
    console.error('❌ Error exporting articles from remote server:', error.message);
    console.log('\n💡 Make sure the remote server is accessible');
    console.log('💡 Check if you need to set REMOTE_API_TOKEN environment variable');
    console.log('💡 The remote server might be using a different API structure');
    process.exit(1);
  }
}

// Run the export
exportArticlesFromRemote(); 