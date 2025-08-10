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

// Simple markdown parser (reusing existing logic)
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
        // Only add non-empty blocks
        if (currentBlock.children && currentBlock.children.length > 0) {
          blocks.push(currentBlock);
        }
        currentBlock = null;
      }
      if (currentList) {
        // Only add non-empty lists
        if (currentList.children && currentList.children.length > 0) {
          blocks.push(currentList);
        }
        currentList = null;
      }
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
            elements.push({
              type: 'link',
              url: linkUrl,
              children: [{ type: 'text', text: linkText, format: 0 }]
            });
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

  // Function to get correct format value for block type
  function getBlockFormat(block) {
    switch (block.type) {
      case 'list':
        return block.format === 'ordered' ? 'ordered' : 'unordered';
      case 'text':
        return 0;
      default:
        return 0;
    }
  }

  const lexicalBlocks = blocks.map((block, index) => {
    // Get the correct format value for this block type
    const formatValue = getBlockFormat(block);
    
    switch (block.type) {
      case 'paragraph':
        return {
          type: 'paragraph',
          format: formatValue,
          children: block.children || [{ type: 'text', text: '', format: 0 }]
        };
      case 'heading':
        return {
          type: 'heading',
          tag: `h${Math.min(block.level, 6)}`,
          level: Math.min(block.level, 6),
          format: formatValue,
          children: block.children || [{ type: 'text', text: '', format: 0 }]
        };
      case 'quote':
        return {
          type: 'quote',
          format: formatValue,
          children: block.children || [{ type: 'text', text: '', format: 0 }]
        };
      case 'list':
        return {
          type: 'list',
          listType: block.format === 'ordered' ? 'number' : 'bullet',
          format: formatValue,
          children: block.children || []
        };
      case 'list-item':
        return {
          type: 'listitem',
          format: formatValue,
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
          format: formatValue,
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
              type: 'text',
              format: 0
            }
          ]
        };
      default:
        console.log(`⚠️  Unknown block type "${block.type}", converting to paragraph`);
        return {
          type: 'paragraph',
          format: formatValue,
          children: block.children || [{ type: 'text', text: '', format: 0 }]
        };
    }
  });

  return lexicalBlocks;
}

// Extract unique categories from articles
function extractCategories(articles) {
  const categoriesMap = new Map();

  articles.forEach(article => {
    if (article.category && article.category._id) {
      const categoryId = article.category._id;
      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: article.category.name,
          description: article.category.description,
          weight: article.category.weight || 0,
          createdAt: article.category.createdAt,
          updatedAt: article.category.updatedAt,
          key: generateCategoryKey(article.category.name)
        });
      }
    }
  });

  return Array.from(categoriesMap.values());
}

// Function to migrate remote articles with proper field mapping
function migrateRemoteArticles() {
  try {
    console.log('🔄 Starting improved migration of remote articles...');

    // Load the exported remote articles
    const remoteArticlesPath = path.join(__dirname, 'remote-articles-simplified.json');

    if (!fs.existsSync(remoteArticlesPath)) {
      console.error('❌ Remote articles file not found. Please run export-articles-remote first.');
      console.log('💡 Run: npm run export-articles-remote');
      process.exit(1);
    }

    const remoteArticles = JSON.parse(fs.readFileSync(remoteArticlesPath, 'utf8'));
    console.log(`📦 Found ${remoteArticles.length} articles to migrate`);

    // Extract categories first
    const categories = extractCategories(remoteArticles);
    console.log(`📂 Found ${categories.length} unique categories`);

    // Create category migration data
    const categoryMigrationData = categories.map(category => ({
      data: {
        name: category.name,
        description: category.description,
        weight: category.weight,
        key: category.key,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    }));

    // Save categories migration data
    const categoriesOutputPath = path.join(__dirname, 'migrated-categories.json');
    fs.writeFileSync(categoriesOutputPath, JSON.stringify(categoryMigrationData, null, 2));
    console.log(`📄 Categories migration data saved to: ${categoriesOutputPath}`);

    // Create category ID mapping for articles
    const categoryIdMapping = new Map();
    categories.forEach((category, index) => {
      categoryIdMapping.set(category.id, index + 1); // Strapi will assign IDs starting from 1
    });

    const migratedArticles = remoteArticles.map((article, index) => {
      console.log(`🔄 Migrating article ${index + 1}/${remoteArticles.length}: ${article.title}`);

      // Convert markdown body to Lexical JSON format
      const richTextBody = markdownToLexicalJSON(article.body);

      // Determine article type
      let articleType = 'tutorial'; // default
      if (article.type === 'share' || article.kind === 'share') {
        articleType = 'share';
      } else if (article.type === 'blog' || article.kind === 'blog') {
        articleType = 'blog';
      }

      // Format date properly
      let formattedDate = null;
      if (article.date) {
        try {
          const date = new Date(article.date);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0]; // yyyy-MM-dd format
          }
        } catch (error) {
          console.warn(`⚠️  Invalid date format for article "${article.title}": ${article.date}`);
        }
      }

      // Create new article structure for Strapi 5
      const migratedArticle = {
        data: {
          title: article.title,
          excerpt: article.excerpt,
          date: formattedDate,
          like: article.like || 0,
          coverUrl: article.coverUrl,
          body: richTextBody,
          altId: article._id || article.id,
          type: articleType,
          publishedAt: article.publishedAt || article.createdAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt
        }
      };

                // Add category relation if available (using key instead of ID)
          if (article.category && article.category._id) {
            const categoryKey = generateCategoryKey(article.category.name);
            migratedArticle.data.category = categoryKey;
          }

          // Handle contributor migration to sharing component (single component, not array)
          if (article.contributor) {
            const contributorName = typeof article.contributor === 'string' 
              ? article.contributor 
              : article.contributor.name || article.contributor.username || 'Unknown';
            
            // Use userLink directly from contributor object
            let userLink = null;
            if (typeof article.contributor === 'object') {
              // First check if userLink exists directly
              if (article.contributor.userLink) {
                userLink = article.contributor.userLink;
              } else if (article.contributor.email) {
                userLink = `mailto:${article.contributor.email}`;
              } else if (article.contributor.website) {
                userLink = article.contributor.website;
              } else if (article.contributor.url) {
                userLink = article.contributor.url;
              } else if (article.contributor.link) {
                userLink = article.contributor.link;
              }
            }
              
            migratedArticle.data.sharing = {
              contributor: contributorName,
              userLink: userLink
            };
          }

          return migratedArticle;
    });

    // Save migrated articles
    const outputPath = path.join(__dirname, 'migrated-remote-articles-improved.json');
    fs.writeFileSync(outputPath, JSON.stringify(migratedArticles, null, 2));

    console.log(`✅ Successfully migrated ${migratedArticles.length} articles`);
    console.log(`📄 Migrated articles saved to: ${outputPath}`);

    // Show statistics
    const typeStats = {};
    migratedArticles.forEach(article => {
      const type = article.data.type;
      typeStats[type] = (typeStats[type] || 0) + 1;
    });

    console.log('\n📊 Migration Statistics:');
    console.log(`📚 Categories: ${categories.length}`);
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`📄 ${type}: ${count} articles`);
    });

    // Show sample of migrated content
    if (migratedArticles.length > 0) {
      console.log('\n📄 Sample migrated body structure:');
      console.log(JSON.stringify(migratedArticles[0].data.body.slice(0, 2), null, 2));
    }

    return { articles: migratedArticles, categories: categoryMigrationData };

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
migrateRemoteArticles(); 