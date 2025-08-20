const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ STRAPI_TOKEN environment variable is required');
  process.exit(1);
}

/**
 * Make API request to Strapi
 */
async function makeApiRequest(endpoint, method = 'GET', data = null, options = {}) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers,
    ...options
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Generate pattern hash for assessment answers
 */
function generatePatternHash(answers) {
  const normalizedAnswers = Object.keys(answers)
    .sort()
    .map(key => `${key}:${answers[key]}`)
    .join('|');
  
  let hash = 0;
  for (let i = 0; i < normalizedAnswers.length; i++) {
    const char = normalizedAnswers.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Convert legacy booklet to AI training data format
 */
function convertLegacyBooklet(booklet) {
  // Extract assessment answers from legacy booklet
  // This will depend on your existing booklet structure
  const assessmentAnswers = {};
  
  // Example conversion logic (adjust based on your actual booklet structure)
  if (booklet.assessmentData) {
    Object.assign(assessmentAnswers, booklet.assessmentData);
  }
  
  // Extract user profile
  const userProfile = {
    age: booklet.userAge,
    gender: booklet.userGender,
    lifeStatus: booklet.userStatus,
    insomniaDuration: booklet.insomniaDuration
  };
  
  // Convert legacy recommendations to AI format
  const aiRecommendations = {
    recommendations: booklet.recommendations?.map(rec => ({
      id: rec.id || `legacy_${rec.title?.toLowerCase().replace(/\s+/g, '_')}`,
      title: rec.title,
      description: rec.description,
      category: rec.category || 'general',
      priority: rec.priority || 'medium',
      confidence: 0.8, // Default confidence for legacy data
      reasoning: rec.reasoning || 'Based on legacy assessment data',
      actions: rec.actions || [{
        title: 'Follow recommendation',
        description: rec.description,
        difficulty: 'medium',
        timeRequired: 'varies',
        frequency: 'as needed',
        expectedImpact: 'Improvement over time'
      }]
    })) || [],
    summary: {
      overallScore: booklet.score || 5,
      primaryIssues: booklet.issues || ['Sleep quality needs improvement'],
      suggestedFocus: booklet.focus || ['general_improvements'],
      urgency: booklet.urgency || 'medium'
    },
    insights: {
      patterns: booklet.patterns || ['Basic sleep patterns identified'],
      correlations: booklet.correlations || ['Sleep habits affect quality'],
      riskFactors: booklet.riskFactors || ['General sleep risks']
    }
  };
  
  return {
    title: `Legacy Booklet - ${booklet.title || 'Unknown'}`,
    description: `Migrated from legacy booklet: ${booklet.description || 'No description'}`,
    patternHash: generatePatternHash(assessmentAnswers),
    assessmentAnswers: JSON.stringify(assessmentAnswers),
    userProfile: JSON.stringify(userProfile),
    recommendations: JSON.stringify(aiRecommendations),
    confidence: 0.8,
    usageCount: booklet.usageCount || 0,
    lastUsed: booklet.lastUsed || new Date().toISOString(),
    category: 'legacy-migrated',
    type: 'legacy-booklet',
    isActive: true,
    tags: JSON.stringify(['legacy', 'migrated']),
    metadata: JSON.stringify({
      originalId: booklet.id,
      migrationDate: new Date().toISOString(),
      source: 'legacy-booklet'
    })
  };
}

/**
 * Create sample AI training data patterns
 */
function createSampleTrainingData() {
  const samplePatterns = [
    {
      title: 'Sample Pattern - Irregular Sleep Schedule',
      description: 'AI-generated recommendations for users with irregular sleep schedules',
      assessmentAnswers: {
        getupregular: 'no',
        hourstosleep: '8',
        hourstofallinsleep: '6',
        sport: 'little',
        pressure: 'normal',
        howlong: 'midterm'
      },
      userProfile: {
        age: 30,
        gender: 'male',
        lifeStatus: 'work',
        insomniaDuration: 'midterm'
      },
      recommendations: {
        recommendations: [
          {
            id: 'sample_sleep_schedule',
            title: '建立规律的睡眠时间',
            description: '每天在同一时间上床睡觉和起床，即使在周末也要保持这个习惯。',
            category: 'sleephabit',
            priority: 'high',
            confidence: 0.9,
            reasoning: '您表示早起时间不规律，这是改善睡眠质量的重要第一步。',
            actions: [
              {
                title: '设定固定睡眠时间',
                description: '选择适合您的睡眠时间，并坚持执行',
                difficulty: 'medium',
                timeRequired: '5分钟',
                frequency: 'daily',
                expectedImpact: '2-3周内改善睡眠质量'
              }
            ]
          }
        ],
        summary: {
          overallScore: 6.5,
          primaryIssues: ['睡眠时间不规律', '运动量不足'],
          suggestedFocus: ['sleep_schedule', 'exercise'],
          urgency: 'medium'
        },
        insights: {
          patterns: ['睡眠时间不规律', '运动量不足'],
          correlations: ['规律作息与睡眠质量正相关'],
          riskFactors: ['长期失眠可能影响生活质量']
        }
      }
    }
  ];
  
  return samplePatterns.map(pattern => ({
    ...pattern,
    patternHash: generatePatternHash(pattern.assessmentAnswers),
    assessmentAnswers: JSON.stringify(pattern.assessmentAnswers),
    userProfile: JSON.stringify(pattern.userProfile),
    recommendations: JSON.stringify(pattern.recommendations),
    confidence: 0.9,
    usageCount: 0,
    lastUsed: new Date().toISOString(),
    category: 'ai-recommendations',
    type: 'ai-booklet',
    isActive: true,
    tags: JSON.stringify(['sample', 'ai-generated']),
    metadata: JSON.stringify({
      createdDate: new Date().toISOString(),
      source: 'sample-data'
    })
  }));
}

/**
 * Main migration function
 */
async function setupAITrainingData() {
  console.log('🚀 Setting up AI Training Data System...\n');
  
  try {
    // Step 1: Check if booklets content type exists
    console.log('📋 Step 1: Checking booklets content type...');
    try {
      await makeApiRequest('/booklets');
      console.log('✅ Booklets content type exists');
    } catch (error) {
      console.log('❌ Booklets content type not found. Please create it first.');
      console.log('   Run: npm run strapi generate content-type booklet');
      return;
    }
    
    // Step 2: Fetch existing booklets (if any)
    console.log('\n📚 Step 2: Fetching existing booklets...');
    let existingBooklets = [];
    try {
      const response = await makeApiRequest('/booklets?populate=*');
      existingBooklets = response.data || [];
      console.log(`✅ Found ${existingBooklets.length} existing booklets`);
    } catch (error) {
      console.log('⚠️  No existing booklets found or error fetching them');
    }
    
    // Step 3: Convert legacy booklets to AI format
    console.log('\n🔄 Step 3: Converting legacy booklets...');
    const convertedBooklets = [];
    
    for (const booklet of existingBooklets) {
      if (booklet.type !== 'ai-booklet') {
        try {
          const converted = convertLegacyBooklet(booklet);
          convertedBooklets.push(converted);
          console.log(`✅ Converted booklet: ${booklet.title || booklet.id}`);
        } catch (error) {
          console.log(`❌ Failed to convert booklet ${booklet.id}:`, error.message);
        }
      }
    }
    
    // Step 4: Create sample AI training data
    console.log('\n🎯 Step 4: Creating sample AI training data...');
    const sampleData = createSampleTrainingData();
    
    // Step 5: Save all new booklets
    console.log('\n💾 Step 5: Saving new booklets...');
    const allNewBooklets = [...convertedBooklets, ...sampleData];
    
    for (const booklet of allNewBooklets) {
      try {
        await makeApiRequest('/booklets', 'POST', booklet);
        console.log(`✅ Saved booklet: ${booklet.title}`);
      } catch (error) {
        console.log(`❌ Failed to save booklet ${booklet.title}:`, error.message);
      }
    }
    
    // Step 6: Create training data cache file
    console.log('\n📁 Step 6: Creating training data cache...');
    const cacheData = {
      patterns: allNewBooklets.map(booklet => ({
        id: booklet.patternHash,
        patternHash: booklet.patternHash,
        assessmentAnswers: JSON.parse(booklet.assessmentAnswers),
        userProfile: JSON.parse(booklet.userProfile),
        aiRecommendations: JSON.parse(booklet.recommendations),
        confidence: booklet.confidence,
        usageCount: booklet.usageCount,
        lastUsed: new Date(booklet.lastUsed),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      metadata: {
        totalPatterns: allNewBooklets.length,
        createdDate: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    
    const cachePath = path.join(__dirname, 'ai-training-data-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
    console.log(`✅ Training data cache saved to: ${cachePath}`);
    
    // Step 7: Summary
    console.log('\n🎉 AI Training Data System Setup Complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Total patterns created: ${allNewBooklets.length}`);
    console.log(`   - Legacy booklets converted: ${convertedBooklets.length}`);
    console.log(`   - Sample patterns created: ${sampleData.length}`);
    console.log(`   - Cache file created: ${cachePath}`);
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Restart your Strapi server to load the new booklet content type');
    console.log('   2. Import the training data cache in your frontend application');
    console.log('   3. Test the AI assessment system with the new training data');
    console.log('   4. Monitor usage patterns and refine recommendations');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupAITrainingData();
}

module.exports = {
  setupAITrainingData,
  convertLegacyBooklet,
  createSampleTrainingData,
  generatePatternHash
};
