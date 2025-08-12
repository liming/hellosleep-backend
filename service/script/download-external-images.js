const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Function to download an image
async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.google.com/',
      },
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(outputPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete the file if there's an error
        reject(err);
      });
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Function to process migrated articles and download external images
async function processExternalImages() {
  try {
    console.log('🖼️  Starting external image download process...');
    
    // Read the migrated articles
    const migratedPath = path.join(__dirname, 'migrated-remote-articles-improved.json');
    const migratedArticles = JSON.parse(fs.readFileSync(migratedPath, 'utf8'));
    
    // Create images directory if it doesn't exist
    const imagesDir = path.join(__dirname, '..', 'public', 'uploads', 'external-images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    let processedCount = 0;
    let downloadedCount = 0;
    let failedCount = 0;
    
    for (const article of migratedArticles) {
      if (!article.data.body || !Array.isArray(article.data.body)) continue;
      
      processedCount++;
      console.log(`📄 Processing article: ${article.data.title}`);
      
      // Process each body element
      for (let i = 0; i < article.data.body.length; i++) {
        const element = article.data.body[i];
        
        if (element.type === 'image' && element.image && element.image.url) {
          const imageUrl = element.image.url;
          
          // Check if it's an external image that needs downloading
          if (imageUrl.includes('mmbiz.qpic.cn') || 
              imageUrl.includes('weixin.qq.com') ||
              imageUrl.includes('qq.com')) {
            
            try {
              // Generate a unique filename
              const urlHash = Buffer.from(imageUrl).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
              const extension = path.extname(imageUrl) || '.jpg';
              const filename = `${urlHash}${extension}`;
              const localPath = path.join(imagesDir, filename);
              
              // Check if image already exists
              if (!fs.existsSync(localPath)) {
                console.log(`  📥 Downloading: ${imageUrl}`);
                await downloadImage(imageUrl, localPath);
                downloadedCount++;
                console.log(`  ✅ Downloaded: ${filename}`);
              } else {
                console.log(`  ⏭️  Already exists: ${filename}`);
              }
              
              // Update the image URL to use local path
              article.data.body[i].image.url = `/uploads/external-images/${filename}`;
              
            } catch (error) {
              console.error(`  ❌ Failed to download image: ${imageUrl}`, error.message);
              failedCount++;
            }
          }
        }
      }
    }
    
    // Save the updated articles
    const updatedPath = path.join(__dirname, 'migrated-remote-articles-with-local-images.json');
    fs.writeFileSync(updatedPath, JSON.stringify(migratedArticles, null, 2));
    
    console.log('\n📊 Download Summary:');
    console.log(`  📄 Articles processed: ${processedCount}`);
    console.log(`  📥 Images downloaded: ${downloadedCount}`);
    console.log(`  ❌ Failed downloads: ${failedCount}`);
    console.log(`  💾 Updated file saved: ${updatedPath}`);
    
  } catch (error) {
    console.error('❌ Error processing external images:', error);
  }
}

// Run the script
if (require.main === module) {
  processExternalImages();
}

module.exports = { processExternalImages }; 