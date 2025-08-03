const fs = require('fs');
const path = require('path');

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
    
    // Handle regular text with inline formatting
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

// Function to convert Markdown to Lexical JSON format
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
        // Convert external images to proper image blocks with external URL
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

// Function to migrate remote articles
function migrateRemoteArticles() {
  try {
    console.log('🔄 Starting migration of remote articles...');
    
    // Load the exported remote articles
    const remoteArticlesPath = path.join(__dirname, 'remote-articles-simplified.json');
    
    if (!fs.existsSync(remoteArticlesPath)) {
      console.error('❌ Remote articles file not found. Please run export-articles-remote first.');
      console.log('💡 Run: npm run export-articles-remote');
      process.exit(1);
    }
    
    const remoteArticles = JSON.parse(fs.readFileSync(remoteArticlesPath, 'utf8'));
    console.log(`📦 Found ${remoteArticles.length} articles to migrate`);
    
    const migratedArticles = remoteArticles.map((article, index) => {
      console.log(`🔄 Migrating article ${index + 1}/${remoteArticles.length}: ${article.title}`);
      
      // Convert markdown body to Lexical JSON format
      const richTextBody = markdownToLexicalJSON(article.body);
      
      // Create new article structure for Strapi 5
      const migratedArticle = {
        data: {
          title: article.title,
          excerpt: article.excerpt,
          date: article.date ? new Date(article.date).toISOString().split('T')[0] : null, // Format as yyyy-MM-dd
          like: article.like,
          coverUrl: article.coverUrl,
          body: richTextBody, // This is now in the Lexical JSON format
          altId: article._id || article.id, // Map remote _id to local altId
          publishedAt: article.publishedAt || article.createdAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt
        }
      };
      
      return migratedArticle;
    });
    
    // Save migrated articles
    const outputPath = path.join(__dirname, 'migrated-remote-articles.json');
    fs.writeFileSync(outputPath, JSON.stringify(migratedArticles, null, 2));
    
    console.log(`✅ Successfully migrated ${migratedArticles.length} articles`);
    console.log(`📄 Migrated articles saved to: ${outputPath}`);
    
    // Show sample of migrated content
    if (migratedArticles.length > 0) {
      console.log('\n📄 Sample migrated body structure:');
      console.log(JSON.stringify(migratedArticles[0].data.body.slice(0, 2), null, 2));
    }
    
    return migratedArticles;
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
migrateRemoteArticles(); 