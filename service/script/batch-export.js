const fs = require('fs');
const path = require('path');

// Export articles from remote Strapi 3 server
async function exportArticlesFromRemote() {
  try {
    console.log('📡 Exporting articles from remote Strapi 3 server...');
    
    // Remote Strapi 3 server configuration
    const REMOTE_STRAPI_URL = 'http://hellosleep.net:1337';
    const API_TOKEN = process.env.REMOTE_API_TOKEN; // Optional: for private content
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add API token if provided
    if (API_TOKEN) {
      headers.Authorization = `Bearer ${API_TOKEN}`;
    }
    
    // First, get the total count of articles
    console.log('🔍 Getting total article count...');
    const countUrl = `${REMOTE_STRAPI_URL}/articles/count`;
    
    const countResponse = await fetch(countUrl, {
      method: 'GET',
      headers,
    });
    
    if (!countResponse.ok) {
      console.warn('⚠️ Could not get article count, will fetch with large limit');
    }
    
    let totalCount = 1000; // Default fallback
    try {
      const countData = await countResponse.json();
      totalCount = typeof countData === 'number' ? countData : countData.count || 1000;
      console.log(`📊 Total articles available: ${totalCount}`);
    } catch (error) {
      console.warn('⚠️ Using fallback limit of 1000 articles');
    }
    
    // Try different population methods for Strapi 3 compatibility
    let data = null;
    let apiUrl = '';
    
    // First try with explicit field population
    try {
      apiUrl = `${REMOTE_STRAPI_URL}/articles?_limit=${totalCount}&_populate=category,author,contributor`;
      console.log(`🔗 Trying with field population: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });
      
      if (response.ok) {
        data = await response.json();
        console.log('✅ Successfully fetched with field population');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('⚠️ Field population failed, trying without population...');
      
      // Fallback: fetch without population, then fetch relations separately
      try {
        apiUrl = `${REMOTE_STRAPI_URL}/articles?_limit=${totalCount}`;
        console.log(`🔗 Fetching basic articles: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        data = await response.json();
        console.log('✅ Successfully fetched basic articles');
        console.log('💡 Relations will need to be populated separately or might already be IDs');
      } catch (fallbackError) {
        throw new Error(`Both population methods failed: ${fallbackError.message}`);
      }
    }
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format from server');
    }
    
    console.log(`\n✅ Successfully exported ${data.length} articles from remote server`);
    
    // Check if we might have hit a limit
    if (data.length >= 100 && data.length < totalCount) {
      console.log(`⚠️ Warning: Fetched ${data.length} articles, but ${totalCount} were expected`);
      console.log('💡 This might indicate pagination limits. Consider implementing batch fetching.');
    }
    
    // Save full export
    const outputPath = path.join(__dirname, 'remote-articles-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`📄 Full export saved to: ${outputPath}`);
    
    // Create a simplified version for easier viewing
    const simplifiedArticles = data.map(article => ({
      _id: article._id || article.id,
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
      // Handle populated relations
      author: article.author ? {
        _id: article.author._id || article.author.id,
        name: article.author.name || article.author.username,
        email: article.author.email,
        createdAt: article.author.createdAt,
        updatedAt: article.author.updatedAt
      } : null,
      category: article.category ? {
        _id: article.category._id || article.category.id,
        name: article.category.name,
        description: article.category.description,
        weight: article.category.weight,
        createdAt: article.category.createdAt,
        updatedAt: article.category.updatedAt
      } : null,
      contributor: article.contributor ? {
        _id: article.contributor._id || article.contributor.id,
        name: article.contributor.name || article.contributor.username,
        email: article.contributor.email,
        userLink: article.contributor.userLink,
        createdAt: article.contributor.createdAt,
        updatedAt: article.contributor.updatedAt
      } : null
    }));
    
    const simplifiedPath = path.join(__dirname, 'remote-articles-simplified.json');
    fs.writeFileSync(simplifiedPath, JSON.stringify(simplifiedArticles, null, 2));
    
    console.log(`📝 Simplified version saved to: ${simplifiedPath}`);
    
    // Show statistics
    const withCategory = simplifiedArticles.filter(a => a.category).length;
    const withAuthor = simplifiedArticles.filter(a => a.author).length;
    const withContributor = simplifiedArticles.filter(a => a.contributor).length;
    
    console.log('\n📊 Export Statistics:');
    console.log(`📄 Total articles: ${simplifiedArticles.length}`);
    console.log(`📂 With category: ${withCategory}`);
    console.log(`👤 With author: ${withAuthor}`);
    console.log(`🤝 With contributor: ${withContributor}`);
    
    // Show sample of body content
    if (simplifiedArticles.length > 0) {
      console.log('\n📄 Sample body content (Markdown):');
      console.log(simplifiedArticles[0].body?.substring(0, 200) + '...');
      
      // Show sample category if available
      const sampleWithCategory = simplifiedArticles.find(a => a.category);
      if (sampleWithCategory) {
        console.log('\n📂 Sample category:');
        console.log(JSON.stringify(sampleWithCategory.category, null, 2));
      }
    }
    
    return simplifiedArticles;
    
  } catch (error) {
    console.error('❌ Error exporting articles from remote server:', error.message);
    console.log('\n💡 Make sure the remote server is accessible');
    console.log('💡 Check if you need to set REMOTE_API_TOKEN environment variable');
    console.log('💡 The remote server might be using a different API structure');
    console.log('💡 Try testing with a smaller limit first: /articles?_limit=10&_populate=*');
    process.exit(1);
  }
}

// Run the export
exportArticlesFromRemote(); 