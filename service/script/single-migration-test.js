const fs = require('fs');
const path = require('path');

// Test single article migration with improved parsing
function testSingleMigration() {
  try {
    console.log('🧪 Testing single article migration...');
    
    // Load a test article from the remote articles
    const remoteArticlesPath = path.join(__dirname, 'remote-articles-simplified.json');
    
    if (!fs.existsSync(remoteArticlesPath)) {
      console.error('❌ Remote articles file not found. Please run export-articles-remote first.');
      console.log('💡 Run: npm run export-articles-remote');
      process.exit(1);
    }
    
    const remoteArticles = JSON.parse(fs.readFileSync(remoteArticlesPath, 'utf8'));
    
    if (!remoteArticles || remoteArticles.length === 0) {
      console.error('❌ No articles found in remote articles file.');
      process.exit(1);
    }
    
    // Use the first article for testing
    const testArticle = remoteArticles[0];
    console.log(`📄 Testing with article: "${testArticle.title}"`);
    
    // Simple markdown parser
    function parseMarkdown(markdown) {
      if (!markdown) return [];
      
      const lines = markdown.split('\n');
      const blocks = [];
      let currentBlock = null;
      let currentList = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line) {
          if (currentBlock) {
            blocks.push(currentBlock);
            currentBlock = null;
          }
          if (currentList) {
            blocks.push(currentList);
            currentList = null;
          }
          continue;
        }
        
        // Handle headings
        if (line.startsWith('#')) {
          if (currentBlock) blocks.push(currentBlock);
          if (currentList) blocks.push(currentList);
          const level = line.match(/^#+/)[0].length;
          const text = line.replace(/^#+\s*/, '');
          currentBlock = {
            type: 'heading',
            level: level,
            children: [{ type: 'text', text: text }]
          };
          blocks.push(currentBlock);
          currentBlock = null;
          currentList = null;
          continue;
        }
        
        // Handle blockquotes
        if (line.startsWith('>')) {
          if (currentBlock) blocks.push(currentBlock);
          if (currentList) blocks.push(currentList);
          const text = line.replace(/^>\s*/, '');
          currentBlock = {
            type: 'quote',
            children: parseInlineElements(text)
          };
          blocks.push(currentBlock);
          currentBlock = null;
          currentList = null;
          continue;
        }
        
        // Handle images: ![alt](url)
        const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
          if (currentBlock) blocks.push(currentBlock);
          if (currentList) blocks.push(currentList);
          currentBlock = {
            type: 'image',
            src: imageMatch[2],
            altText: imageMatch[1]
          };
          blocks.push(currentBlock);
          currentBlock = null;
          currentList = null;
          continue;
        }
        
        // Handle unordered lists: - item or * item
        if (line.match(/^[-*]\s+/)) {
          if (currentBlock) {
            blocks.push(currentBlock);
            currentBlock = null;
          }
          if (!currentList) {
            currentList = {
              type: 'list',
              format: 'unordered',
              children: []
            };
          }
          const text = line.replace(/^[-*]\s+/, '');
          currentList.children.push({
            type: 'list-item',
            children: parseInlineElements(text)
          });
          continue;
        }
        
        // Handle ordered lists: 1. item, 2. item, etc.
        if (line.match(/^\d+\.\s+/)) {
          if (currentBlock) {
            blocks.push(currentBlock);
            currentBlock = null;
          }
          if (!currentList) {
            currentList = {
              type: 'list',
              format: 'ordered',
              children: []
            };
          }
          const text = line.replace(/^\d+\.\s+/, '');
          currentList.children.push({
            type: 'list-item',
            children: parseInlineElements(text)
          });
          continue;
        }
        
        // If we have a current list but this line is not a list item, end the list
        if (currentList) {
          blocks.push(currentList);
          currentList = null;
        }
        
        // Handle regular paragraphs
        if (!currentBlock) {
          currentBlock = {
            type: 'paragraph',
            children: []
          };
        }
        
        // Parse inline elements (bold, links)
        const children = parseInlineElements(line);
        currentBlock.children.push(...children);
      }
      
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      if (currentList) {
        blocks.push(currentList);
      }
      
      return blocks;
    }

    function parseInlineElements(text) {
      const children = [];
      let currentIndex = 0;
      
      while (currentIndex < text.length) {
        // Handle bold text: **text**
        const boldMatch = text.slice(currentIndex).match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          children.push({
            type: 'text',
            text: boldMatch[1],
            bold: true
          });
          currentIndex += boldMatch[0].length;
          continue;
        }
        
        // Handle links: [text](url)
        const linkMatch = text.slice(currentIndex).match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          children.push({
            type: 'link',
            url: linkMatch[2],
            children: [{ type: 'text', text: linkMatch[1] }]
          });
          currentIndex += linkMatch[0].length;
          continue;
        }
        
        // Handle regular text
        const nextBold = text.indexOf('**', currentIndex);
        const nextLink = text.indexOf('[', currentIndex);
        
        let endIndex = text.length;
        if (nextBold !== -1 && nextBold < endIndex) endIndex = nextBold;
        if (nextLink !== -1 && nextLink < endIndex) endIndex = nextLink;
        
        const plainText = text.slice(currentIndex, endIndex);
        if (plainText) {
          children.push({
            type: 'text',
            text: plainText
          });
        }
        
        currentIndex = endIndex;
      }
      
      return children;
    }

    function markdownToLexicalJSON(markdown) {
      const blocks = parseMarkdown(markdown);
      const lexicalBlocks = blocks.map(block => {
        switch (block.type) {
          case 'paragraph': 
            return { type: 'paragraph', children: block.children };
          case 'heading': 
            return { type: 'heading', level: block.level, children: block.children };
          case 'quote': 
            return { type: 'quote', children: block.children };
          case 'list': 
            return { 
              type: 'list', 
              format: block.format, 
              children: block.children 
            };
          case 'listitem': 
            // Convert list items to paragraphs for now
            return { type: 'paragraph', children: block.children };
          case 'image': 
            // Convert external images to proper Strapi image format with external provider
            return { 
              type: 'image',
              image: {
                name: block.altText || 'image',
                alternativeText: block.altText || 'image',
                url: block.src,
                caption: null,
                width: 640,
                height: 427,
                formats: {
                  small: {
                    name: 'small_' + (block.altText || 'image'),
                    hash: 'small_' + (block.altText || 'image'),
                    ext: '.jpg',
                    mime: 'image/jpeg',
                    path: null,
                    width: 500,
                    height: 334,
                    size: 25.88,
                    sizeInBytes: 25875,
                    url: block.src
                  },
                  thumbnail: {
                    name: 'thumbnail_' + (block.altText || 'image'),
                    hash: 'thumbnail_' + (block.altText || 'image'),
                    ext: '.jpg',
                    mime: 'image/jpeg',
                    path: null,
                    width: 234,
                    height: 156,
                    size: 6.56,
                    sizeInBytes: 6557,
                    url: block.src
                  }
                },
                hash: (block.altText || 'image') + '_hash',
                ext: '.jpg',
                mime: 'image/jpeg',
                size: 40.46,
                previewUrl: null,
                provider: 'external',
                provider_metadata: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              children: [
                {
                  type: 'text',
                  text: ''
                }
              ]
            };
          default: 
            // Convert any unknown block types to paragraphs
            console.log(`⚠️  Unknown block type "${block.type}", converting to paragraph`);
            return { 
              type: 'paragraph', 
              children: block.children || [{ type: 'text', text: '' }] 
            };
        }
      });
      return lexicalBlocks;
    }

    // Migrate the single article
    console.log('🔄 Migrating article with new parsing...');
    const richTextBody = markdownToLexicalJSON(testArticle.body);
    
    const migratedArticle = {
      data: {
        title: testArticle.title,
        excerpt: testArticle.excerpt,
        date: testArticle.date ? new Date(testArticle.date).toISOString().split('T')[0] : null,
        like: testArticle.like,
        coverUrl: testArticle.coverUrl,
        body: richTextBody,
        altId: testArticle._id || testArticle.id,
        publishedAt: testArticle.publishedAt || testArticle.createdAt,
        createdAt: testArticle.createdAt,
        updatedAt: testArticle.updatedAt
      }
    };

    // Save the single migrated article
    const outputPath = path.join(__dirname, 'single-migrated-article.json');
    fs.writeFileSync(outputPath, JSON.stringify([migratedArticle], null, 2));
    console.log(`✅ Single article migrated and saved to: ${outputPath}`);
    
    // Show sample of the migrated content
    console.log('\n📄 Sample migrated body structure:');
    console.log(JSON.stringify(richTextBody.slice(0, 3), null, 2));
    
    console.log('\n🎉 Single article migration test completed!');
    console.log('💡 You can now test importing this single article');
    
  } catch (error) {
    console.error('❌ Single article migration failed:', error.message);
    process.exit(1);
  }
}

testSingleMigration();