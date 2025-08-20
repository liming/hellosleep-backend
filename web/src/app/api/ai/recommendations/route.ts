import { NextRequest, NextResponse } from 'next/server';
import { type AIRecommendationRequest, type AIRecommendationResponse } from '@/lib/ai-assessment-engine';
import { mapAnswersToBookletFacts, prioritizeBookletFacts } from '@/data/assessment-booklets-mapping';

// You can integrate with various AI services:
// - OpenAI GPT-4
// - Anthropic Claude
// - Local AI models (Ollama, etc.)
// - Custom fine-tuned models

const AI_SERVICE_CONFIG = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  // Anthropic Configuration
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-sonnet-20240229',
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  // Local AI Configuration (e.g., Ollama)
  local: {
    endpoint: process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434/api/generate',
    model: 'llama2:13b'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: AIRecommendationRequest = await request.json();
    
    // Validate request
    if (!body.answers || Object.keys(body.answers).length === 0) {
      return NextResponse.json(
        { error: 'Assessment answers are required' },
        { status: 400 }
      );
    }

    // Generate AI recommendations
    const recommendations = await generateAIRecommendations(body);
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('AI recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

async function generateAIRecommendations(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
  // Try different AI services in order of preference
  const services = ['openai', 'anthropic', 'local'];
  
  for (const service of services) {
    try {
      const result = await callAIService(service, request);
      if (result) {
        return result;
      }
    } catch (error) {
      console.warn(`AI service ${service} failed:`, error);
      continue;
    }
  }
  
  // If all AI services fail, return fallback recommendations
  return generateFallbackRecommendations(request);
}

async function callAIService(service: string, request: AIRecommendationRequest): Promise<AIRecommendationResponse | null> {
  switch (service) {
    case 'openai':
      return await callOpenAI(request);
    case 'anthropic':
      return await callAnthropic(request);
    case 'local':
      return await callLocalAI(request);
    default:
      return null;
  }
}

async function callOpenAI(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
  const config = AI_SERVICE_CONFIG.openai;
  if (!config.apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = buildOpenAIPrompt(request);
  
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are a sleep health expert AI assistant. Analyze assessment answers and provide personalized recommendations for improving sleep quality.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;
  
  return parseAIResponse(aiResponse);
}

async function callAnthropic(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
  const config = AI_SERVICE_CONFIG.anthropic;
  if (!config.apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = buildAnthropicPrompt(request);
  
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.content[0].text;
  
  return parseAIResponse(aiResponse);
}

async function callLocalAI(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
  const config = AI_SERVICE_CONFIG.local;
  
  const prompt = buildLocalAIPrompt(request);
  
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      prompt: prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Local AI API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.response;
  
  return parseAIResponse(aiResponse);
}

function buildOpenAIPrompt(request: AIRecommendationRequest): string {
  // Get relevant booklet facts based on answers
  const relevantFacts = mapAnswersToBookletFacts(request.answers);
  const prioritizedFacts = prioritizeBookletFacts(relevantFacts, request.answers);

  return `你是一位专业的睡眠健康顾问。基于用户的睡眠评估回答和循证医学建议，请生成个性化的睡眠改善建议。

用户档案：
- 年龄：${request.userProfile.age || '未知'}
- 性别：${request.userProfile.gender || '未知'}
- 生活状态：${request.userProfile.lifeStatus || '未知'}
- 失眠持续时间：${request.userProfile.insomniaDuration || '未知'}

评估概况：
- 总问题数：${request.context.totalQuestions}
- 已回答问题：${request.context.answeredQuestions}
- 各部分得分：${JSON.stringify(request.context.sectionBreakdown)}

基于循证医学的相关建议：
${prioritizedFacts.slice(0, 5).map(fact => 
  `【${fact.description}】${fact.content}${fact.tutorialLink ? ` 详细阅读：${fact.tutorialLink}` : ''}`
).join('\n\n')}

用户回答详情：
${Object.entries(request.answers).map(([key, value]) => `${key}: ${value}`).join('\n')}

请基于以上信息，特别是循证医学建议，生成3-5个具体的睡眠改善建议。每个建议应包含：
1. 标题（简洁明了）
2. 详细说明（为什么重要，如何实施，结合循证建议）
3. 优先级（high/medium/low）
4. 预期效果（短期/长期）
5. 实施难度（easy/medium/hard）
6. 相关教程链接（如适用）

请用中文回答，建议要实用、可操作，避免过于宽泛的建议。优先使用提供的循证医学建议作为基础。

返回JSON格式：
{
  "recommendations": [
    {
      "id": "unique_id",
      "title": "建议标题",
      "description": "详细说明",
      "category": "sleephabit|lifestyle|workstudy|attitude",
      "priority": "high|medium|low",
      "confidence": 0.8,
      "reasoning": "推荐原因",
      "actions": [
        {
          "title": "行动标题",
          "description": "具体描述",
          "difficulty": "easy|medium|hard",
          "timeRequired": "时间要求",
          "frequency": "频率",
          "expectedImpact": "预期效果"
        }
      ]
    }
  ],
  "summary": {
    "primaryIssues": ["主要问题1", "主要问题2"],
    "suggestedFocus": ["重点关注1", "重点关注2"],
    "urgency": "low|medium|high"
  },
  "insights": {
    "patterns": ["模式1", "模式2"],
    "correlations": ["关联1", "关联2"],
    "riskFactors": ["风险因素1", "风险因素2"]
  }
}
4. Suggested focus areas
5. Urgency level (low/medium/high)
6. Key insights and patterns

Format the response as valid JSON with the following structure:
{
  "recommendations": [
    {
      "id": "unique_id",
      "title": "Recommendation title",
      "description": "Detailed description",
      "category": "sleephabit|lifestyle|working_study|attitude|general",
      "priority": "high|medium|low",
      "confidence": 0.8,
      "reasoning": "Why this recommendation is relevant",
      "actions": [
        {
          "title": "Action title",
          "description": "Action description",
          "difficulty": "easy|medium|hard",
          "timeRequired": "5 minutes",
          "frequency": "daily",
          "expectedImpact": "Expected improvement timeline"
        }
      ]
    }
  ],
  "summary": {
    "primaryIssues": ["issue1", "issue2"],
    "suggestedFocus": ["focus1", "focus2"],
    "urgency": "medium"
  },
  "insights": {
    "patterns": ["pattern1", "pattern2"],
    "correlations": ["correlation1"],
    "riskFactors": ["risk1", "risk2"]
  }
}`;
}

function buildAnthropicPrompt(request: AIRecommendationRequest): string {
  return `You are a sleep health expert. Analyze this sleep assessment and provide personalized recommendations.

Assessment Data:
${JSON.stringify(request, null, 2)}

Generate recommendations in JSON format as specified in the system message.`;
}

function buildLocalAIPrompt(request: AIRecommendationRequest): string {
  return `Sleep Assessment Analysis:

User: ${JSON.stringify(request.userProfile)}
Answers: ${JSON.stringify(request.answers)}
Context: ${JSON.stringify(request.context)}

Provide sleep recommendations in JSON format.`;
}

function parseAIResponse(aiResponse: string): AIRecommendationResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, throw error to trigger fallback
    throw new Error('No valid JSON found in AI response');
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw error;
  }
}

function generateFallbackRecommendations(request: AIRecommendationRequest): AIRecommendationResponse {
  // Simple rule-based fallback system
  const recommendations = [];
  const answers = request.answers;
  
  // Basic recommendations based on common patterns
  if (answers.getupregular === 'no') {
    recommendations.push({
      id: 'fallback_schedule',
      title: '建立规律的睡眠时间',
      description: '每天在同一时间上床睡觉和起床，即使在周末也要保持这个习惯。',
      category: 'sleephabit',
      priority: 'high' as const,
      confidence: 0.8,
      reasoning: '您表示早起时间不规律，这是改善睡眠质量的重要第一步。',
      actions: [
        {
          title: '设定固定睡眠时间',
          description: '选择适合您的睡眠时间，并坚持执行',
          difficulty: 'medium' as const,
          timeRequired: '5分钟',
          frequency: 'daily',
          expectedImpact: '2-3周内改善睡眠质量'
        }
      ]
    });
  }
  
  if (answers.sport === 'little' || answers.sport === 'none') {
    recommendations.push({
      id: 'fallback_exercise',
      title: '增加运动量',
      description: '适度的运动有助于改善睡眠质量。',
      category: 'lifestyle',
      priority: 'medium' as const,
      confidence: 0.7,
      reasoning: '您表示运动量较少，增加适度运动可以改善睡眠。',
      actions: [
        {
          title: '开始轻度运动',
          description: '每天进行30分钟的散步或轻度运动',
          difficulty: 'easy' as const,
          timeRequired: '30分钟',
          frequency: 'daily',
          expectedImpact: '1-2周内开始感受到改善'
        }
      ]
    });
  }
  
  // Determine urgency based on key factors
  let urgency: 'low' | 'medium' | 'high' = 'low';
  if (answers.howlong === 'verylongterm' || answers.medicine === 'yes') {
    urgency = 'high';
  } else if (answers.howlong === 'longterm' || answers.getupregular === 'no') {
    urgency = 'medium';
  }
  
  return {
    recommendations,
    summary: {
      primaryIssues: ['睡眠时间不规律', '运动量不足'],
      suggestedFocus: ['sleep_schedule', 'lifestyle_changes'],
      urgency
    },
    insights: {
      patterns: ['睡眠时间不规律', '运动量不足'],
      correlations: ['规律作息与睡眠质量正相关'],
      riskFactors: ['长期失眠可能影响生活质量']
    }
  };
}
