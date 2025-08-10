const fs = require('fs');
const path = require('path');

// Function to generate UID key from Chinese category name
function generateCategoryKey(chineseName) {
  const keyMapping = {
    '失眠者必读': 'insomnia-must-read',
    '常见问题': 'common-questions', 
    '改善生活': 'improve-life',
    '专题': 'special-topics',
    '误区': 'misconceptions',
    '基础知识': 'basic-knowledge'
  };
  
  return keyMapping[chineseName] || chineseName.toLowerCase().replace(/\s+/g, '-');
}

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
    
    // Select a random article for testing
    // Find a tutorial article with category for testing
    let testArticle = null;
    let testIndex = 0;
    
    // First try to find a tutorial article with category
    for (let i = 0; i < remoteArticles.length; i++) {
      const article = remoteArticles[i];
      if (article.type === 'tutorial' && article.category) {
        testArticle = article;
        testIndex = i;
        break;
      }
    }
    
    // If no tutorial with category found, find any tutorial
    if (!testArticle) {
      for (let i = 0; i < remoteArticles.length; i++) {
        const article = remoteArticles[i];
        if (article.type === 'tutorial') {
          testArticle = article;
          testIndex = i;
          break;
        }
      }
    }
    
    // If still no tutorial found, pick a random article
    if (!testArticle) {
      testIndex = Math.floor(Math.random() * remoteArticles.length);
      testArticle = remoteArticles[testIndex];
    }
    
    console.log(`📄 Testing with article ${testIndex + 1}/${remoteArticles.length}: "${testArticle.title}"`);
    console.log(`📁 Article type: ${testArticle.type}`);
    console.log(`📂 Has category: ${testArticle.category ? '✅ Yes' : '❌ No'}`);
    if (testArticle.category) {
      console.log(`   Category: ${testArticle.category.name}`);
    }
    
    // Simple markdown parser with improved logic
    function parseMarkdown(markdown) {
      if (!markdown) return [];

      const lines = markdown.split('\n');
      const blocks = [];
      let currentBlock = null;
      let currentList = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
          // Only add non-empty blocks
          if (currentBlock && currentBlock.children && currentBlock.children.length > 0) {
            blocks.push(currentBlock);
          }
          currentBlock = null;
          
          // Only add non-empty lists
          if (currentList && currentList.children && currentList.children.length > 0) {
            blocks.push(currentList);
          }
          currentList = null;
          continue;
        }

        // Handle headings
        if (line.startsWith('#')) {
          if (currentBlock && currentBlock.children && currentBlock.children.length > 0) blocks.push(currentBlock);
          if (currentList && currentList.children && currentList.children.length > 0) blocks.push(currentList);
          const level = line.match(/^#+/)[0].length;
          const text = line.replace(/^#+\s*/, '');
          if (text.trim()) {
            currentBlock = {
              type: 'heading',
              level: level,
              children: [{ type: 'text', text: text.trim(), format: 0 }]
            };
            blocks.push(currentBlock);
          }
          currentBlock = null;
          currentList = null;
          continue;
        }

        // Handle blockquotes
        if (line.startsWith('>')) {
          if (currentBlock && currentBlock.children && currentBlock.children.length > 0) blocks.push(currentBlock);
          if (currentList && currentList.children && currentList.children.length > 0) blocks.push(currentList);
          const text = line.replace(/^>\s*/, '');
          if (text.trim()) {
            currentBlock = {
              type: 'quote',
              children: parseInlineElements(text.trim())
            };
            blocks.push(currentBlock);
          }
          currentBlock = null;
          currentList = null;
          continue;
        }

        // Handle images: ![alt](url)
        const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
          if (currentBlock && currentBlock.children && currentBlock.children.length > 0) blocks.push(currentBlock);
          if (currentList && currentList.children && currentList.children.length > 0) blocks.push(currentList);
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
          if (currentBlock && currentBlock.children && currentBlock.children.length > 0) {
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
          if (text.trim()) {
            currentList.children.push({
              type: 'list-item',
              children: parseInlineElements(text.trim())
            });
          }
          continue;
        }

        // Handle ordered lists: 1. item, 2. item, etc.
        if (line.match(/^\d+\.\s+/)) {
          if (currentBlock && currentBlock.children && currentBlock.children.length > 0) {
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
          if (text.trim()) {
            currentList.children.push({
              type: 'list-item',
              children: parseInlineElements(text.trim())
            });
          }
          continue;
        }

        // Handle paragraphs (default)
        if (!currentBlock) {
          currentBlock = {
            type: 'paragraph',
            children: parseInlineElements(line)
          };
        } else {
          // Append to current paragraph
          if (currentBlock.children && currentBlock.children.length > 0) {
            currentBlock.children.push({ type: 'text', text: '\n', format: 0 });
            currentBlock.children.push(...parseInlineElements(line));
          }
        }
      }

      // Only add non-empty blocks
      if (currentBlock && currentBlock.children && currentBlock.children.length > 0) blocks.push(currentBlock);
      if (currentList && currentList.children && currentList.children.length > 0) blocks.push(currentList);

      return blocks;
    }

    function parseInlineElements(text) {
      const elements = [];
      let currentText = '';
      let i = 0;

      while (i < text.length) {
        // Handle bold: **text**
        if (text.substring(i, i + 2) === '**') {
          if (currentText) {
            elements.push({ type: 'text', text: currentText, format: 0 });
            currentText = '';
          }
          i += 2;
          let boldText = '';
          while (i < text.length && text.substring(i, i + 2) !== '**') {
            boldText += text[i];
            i++;
          }
          if (i < text.length) {
            elements.push({
              type: 'text',
              text: boldText,
              format: 1 // bold
            });
            i += 2;
          }
          continue;
        }

        // Handle italic: *text*
        if (text[i] === '*' && (i === 0 || text[i - 1] !== '*')) {
          if (currentText) {
            elements.push({ type: 'text', text: currentText, format: 0 });
            currentText = '';
          }
          i++;
          let italicText = '';
          while (i < text.length && text[i] !== '*') {
            italicText += text[i];
            i++;
          }
          if (i < text.length) {
            elements.push({
              type: 'text',
              text: italicText,
              format: 2 // italic
            });
            i++;
          }
          continue;
        }

        // Handle links: [text](url)
        if (text[i] === '[') {
          if (currentText) {
            elements.push({ type: 'text', text: currentText, format: 0 });
            currentText = '';
          }
          i++;
          let linkText = '';
          while (i < text.length && text[i] !== ']') {
            linkText += text[i];
            i++;
          }
          if (i < text.length && text[i] === ']') {
            i++;
            if (i < text.length && text[i] === '(') {
              i++;
              let linkUrl = '';
              while (i < text.length && text[i] !== ')') {
                linkUrl += text[i];
                i++;
              }
              if (i < text.length && text[i] === ')') {
                // Validate URL - if it's an internal link, skip it or convert it
                if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
                  elements.push({
                    type: 'link',
                    url: linkUrl,
                    children: [{ type: 'text', text: linkText, format: 0 }]
                  });
                } else {
                  // Convert internal links to plain text
                  elements.push({ type: 'text', text: linkText, format: 0 });
                }
                i++;
              }
            }
          }
          continue;
        }

        currentText += text[i];
        i++;
      }

      if (currentText) {
        elements.push({ type: 'text', text: currentText, format: 0 });
      }

      return elements;
    }

    function markdownToLexicalJSON(markdown) {
      const blocks = parseMarkdown(markdown);

      const lexicalBlocks = blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return {
              type: 'paragraph',
              children: block.children || [{ type: 'text', text: '', format: 0 }]
            };
          case 'heading':
            return {
              type: 'heading',
              tag: `h${Math.min(block.level, 6)}`,
              level: Math.min(block.level, 6),
              children: block.children || [{ type: 'text', text: '', format: 0 }]
            };
          case 'quote':
            return {
              type: 'quote',
              children: block.children || [{ type: 'text', text: '', format: 0 }]
            };
          case 'list':
            return {
              type: 'list',
              format: block.format === 'ordered' ? 'ordered' : 'unordered',
              listType: block.format === 'ordered' ? 'number' : 'bullet',
              children: block.children || []
            };
          case 'list-item':
            return {
              type: 'listitem',
              children: block.children || [{ type: 'text', text: '', format: 0 }]
            };
          case 'image':
            // Create a proper image block that matches Strapi's expected structure
            const imageUrl = block.src;
            const imageExt = imageUrl.includes('.jpg') ? 'jpg' : 
                          imageUrl.includes('.png') ? 'png' : 
                          imageUrl.includes('.gif') ? 'gif' : 
                          imageUrl.includes('.webp') ? 'webp' : 'jpg';
            const imageName = block.altText || `image-${index}`;
            const imageHash = `external_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            return {
              type: 'image',
              image: {
                ext: `.${imageExt}`,
                url: imageUrl,
                hash: imageHash,
                mime: `image/${imageExt}`,
                name: `${imageName}.${imageExt}`,
                size: 40.46,
                width: 640,
                height: 480,
                caption: null,
                formats: {
                  small: {
                    ext: `.${imageExt}`,
                    url: imageUrl,
                    hash: `small_${imageHash}`,
                    mime: `image/${imageExt}`,
                    name: `small_${imageName}.${imageExt}`,
                    path: null,
                    size: 25.88,
                    width: 500,
                    height: 375,
                    sizeInBytes: 25875
                  },
                  thumbnail: {
                    ext: `.${imageExt}`,
                    url: imageUrl,
                    hash: `thumbnail_${imageHash}`,
                    mime: `image/${imageExt}`,
                    name: `thumbnail_${imageName}.${imageExt}`,
                    path: null,
                    size: 6.56,
                    width: 234,
                    height: 175,
                    sizeInBytes: 6557
                  }
                },
                provider: 'external',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                previewUrl: null,
                alternativeText: block.altText || '',
                provider_metadata: null
              },
              children: [
                {
                  text: '',
                  type: 'text'
                }
              ]
            };
          default:
            console.log(`⚠️  Unknown block type "${block.type}", converting to paragraph`);
            return {
              type: 'paragraph',
              children: block.children || [{ type: 'text', text: '', format: 0 }]
            };
        }
      });

      return lexicalBlocks;
    }

    // Migrate the single article
    console.log('🔄 Migrating article with improved parsing...');
    const richTextBody = markdownToLexicalJSON(testArticle.body);
    
    // Determine article type
    let articleType = 'tutorial'; // default
    if (testArticle.type === 'share' || testArticle.kind === 'share') {
      articleType = 'share';
    } else if (testArticle.type === 'blog' || testArticle.kind === 'blog') {
      articleType = 'blog';
    }

    // Format date properly
    let formattedDate = null;
    if (testArticle.date) {
      try {
        const date = new Date(testArticle.date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0]; // yyyy-MM-dd format
        }
      } catch (error) {
        console.warn(`⚠️  Invalid date format: ${testArticle.date}`);
      }
    }
    
    const migratedArticle = {
      data: {
        title: testArticle.title,
        excerpt: testArticle.excerpt,
        date: formattedDate,
        like: testArticle.like || 0,
        coverUrl: testArticle.coverUrl,
        body: richTextBody,
        altId: testArticle._id || testArticle.id,
        type: articleType,
        publishedAt: testArticle.publishedAt || testArticle.createdAt,
        createdAt: testArticle.createdAt,
        updatedAt: testArticle.updatedAt
      }
    };

    // Handle contributor migration to sharing component (single component, not array)
    if (testArticle.contributor) {
      const contributorName = typeof testArticle.contributor === 'string' 
        ? testArticle.contributor 
        : testArticle.contributor.name || testArticle.contributor.username || 'Unknown';
      
      // Use userLink directly from contributor object
      let userLink = null;
      if (typeof testArticle.contributor === 'object') {
        // First check if userLink exists directly
        if (testArticle.contributor.userLink) {
          userLink = testArticle.contributor.userLink;
        } else if (testArticle.contributor.email) {
          userLink = `mailto:${testArticle.contributor.email}`;
        } else if (testArticle.contributor.website) {
          userLink = testArticle.contributor.website;
        } else if (testArticle.contributor.url) {
          userLink = testArticle.contributor.url;
        } else if (testArticle.contributor.link) {
          userLink = testArticle.contributor.link;
        }
      }
        
      migratedArticle.data.sharing = {
        contributor: contributorName,
        userLink: userLink
      };
    }

    // Handle category relation (using key)
    if (testArticle.category && testArticle.category._id) {
      const categoryKey = generateCategoryKey(testArticle.category.name);
      migratedArticle.data.category = categoryKey;
      console.log(`📂 Category relation added: ${testArticle.category.name} (Key: ${categoryKey})`);
    }

    // Save the single migrated article
    const outputPath = path.join(__dirname, 'single-migrated-article.json');
    fs.writeFileSync(outputPath, JSON.stringify([migratedArticle], null, 2));
    console.log(`✅ Single article migrated and saved to: ${outputPath}`);
    
    // Show sample of the migrated content
    console.log('\n📄 Sample migrated body structure:');
    console.log(JSON.stringify(richTextBody.slice(0, 3), null, 2));
    
    // Show article statistics
    console.log('\n📊 Article Statistics:');
    console.log(`📄 Type: ${articleType}`);
    console.log(`📅 Date: ${formattedDate || 'No date'}`);
    console.log(`❤️  Likes: ${testArticle.like || 0}`);
    console.log(`📝 Body blocks: ${richTextBody.length}`);
    
    // Count different block types
    const blockStats = {};
    richTextBody.forEach(block => {
      blockStats[block.type] = (blockStats[block.type] || 0) + 1;
    });
    
    console.log('📊 Block types:');
    Object.entries(blockStats).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });
    
    console.log('\n🎉 Single article migration test completed!');
    console.log('💡 You can now test importing this single article with single-import-test.js');
    
  } catch (error) {
    console.error('❌ Single article migration failed:', error.message);
    process.exit(1);
  }
}

testSingleMigration();