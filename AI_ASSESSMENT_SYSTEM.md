# AI-Powered Assessment Recommendation System

## Overview

This system replaces the hard-coded assessment calculations with an intelligent AI-powered recommendation engine that dynamically generates personalized suggestions based on user answers. The system integrates with multiple AI services and provides fallback mechanisms for reliability.

## Architecture

### Core Components

1. **AI Assessment Engine** (`web/src/lib/ai-assessment-engine.ts`)
   - Handles AI service integration
   - Manages request/response formatting
   - Provides fallback recommendations

2. **Enhanced Assessment Engine** (`web/src/lib/enhanced-assessment-engine.ts`)
   - Combines original assessment logic with AI recommendations
   - Fetches related articles from Strapi
   - Provides progressive insights during assessment

3. **AI API Endpoint** (`web/src/app/api/ai/recommendations/route.ts`)
   - Handles AI service calls
   - Supports multiple AI providers (OpenAI, Anthropic, Local)
   - Provides fallback mechanisms

## Key Features

### 🤖 **AI-Powered Recommendations**
- **Dynamic Generation**: Recommendations are generated based on actual assessment answers
- **Personalized Insights**: AI analyzes patterns and correlations in user responses
- **Context-Aware**: Considers user profile, life status, and insomnia duration
- **Confidence Scoring**: Each recommendation includes confidence levels

### 🔄 **Multi-Service Integration**
- **OpenAI GPT-4**: Primary AI service for high-quality recommendations
- **Anthropic Claude**: Alternative service for different perspectives
- **Local AI Models**: Ollama integration for privacy-focused deployments
- **Fallback System**: Rule-based recommendations when AI services are unavailable

### 📊 **Enhanced Analytics**
- **Pattern Recognition**: Identifies behavioral patterns from answers
- **Correlation Analysis**: Finds relationships between different factors
- **Risk Assessment**: Evaluates potential risk factors
- **Progress Tracking**: Compares current results with previous assessments

### 📚 **Article Integration**
- **Dynamic Article Fetching**: Retrieves relevant articles from Strapi based on AI recommendations
- **Category Mapping**: Maps AI recommendation categories to Strapi article categories
- **Relevance Scoring**: Ranks articles by relevance to user's specific situation

## Implementation Details

### AI Request Structure

```typescript
interface AIRecommendationRequest {
  answers: Record<string, string>;           // All assessment answers
  userProfile: {                            // Extracted user information
    age?: number;
    gender?: string;
    lifeStatus?: string;
    insomniaDuration?: string;
  };
  context: {                                // Assessment context
    totalQuestions: number;
    answeredQuestions: number;
    sectionBreakdown: Record<string, number>;
  };
}
```

### AI Response Structure

```typescript
interface AIRecommendationResponse {
  recommendations: AIRecommendation[];      // Personalized recommendations
  summary: {                                // Overall assessment summary
    overallScore: number;
    primaryIssues: string[];
    suggestedFocus: string[];
    urgency: 'low' | 'medium' | 'high';
  };
  insights: {                               // AI-generated insights
    patterns: string[];
    correlations: string[];
    riskFactors: string[];
  };
}
```

### Recommendation Structure

```typescript
interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;                       // 0-1 confidence score
  reasoning: string;                        // Why this recommendation is relevant
  actions: {                                // Specific actionable steps
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeRequired: string;
    frequency: string;
    expectedImpact: string;
  }[];
  relatedArticles?: {                       // Links to relevant articles
    title: string;
    url: string;
    relevance: number;
    summary: string;
  }[];
}
```

## AI Service Integration

### OpenAI GPT-4 Integration

```typescript
// Environment variables required:
// OPENAI_API_KEY=your_openai_api_key

const prompt = buildOpenAIPrompt(request);
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a sleep health expert AI assistant...'
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
```

### Anthropic Claude Integration

```typescript
// Environment variables required:
// ANTHROPIC_API_KEY=your_anthropic_api_key

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ANTHROPIC_API_KEY}`,
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  })
});
```

### Local AI Integration (Ollama)

```typescript
// Environment variables required:
// LOCAL_AI_ENDPOINT=http://localhost:11434/api/generate

const response = await fetch(LOCAL_AI_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama2:13b',
    prompt: prompt,
    stream: false
  })
});
```

## Usage Examples

### Basic AI Assessment Processing

```typescript
import { enhancedAssessmentEngine } from '@/lib/enhanced-assessment-engine';

// Process assessment with AI recommendations
const result = await enhancedAssessmentEngine.processAssessmentWithAI(answers);

// Access AI-enhanced results
console.log('AI Recommendations:', result.aiRecommendations.recommendations);
console.log('Related Articles:', result.relatedArticles);
console.log('Personalized Summary:', result.personalizedSummary);
```

### Progressive Recommendations

```typescript
// Get real-time recommendations as user progresses
const progressive = await enhancedAssessmentEngine.getProgressiveRecommendations(answers);
console.log('Immediate Actions:', progressive.immediate);
console.log('Upcoming Actions:', progressive.upcoming);
```

### Progress with Insights

```typescript
// Get progress with AI insights
const progress = enhancedAssessmentEngine.getProgressWithInsights(answers);
console.log('Progress:', progress.percentage + '%');
console.log('Insights:', progress.insights);
console.log('Next Steps:', progress.nextSteps);
```

## Configuration

### Environment Variables

```bash
# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
LOCAL_AI_ENDPOINT=http://localhost:11434/api/generate

# API Endpoints
NEXT_PUBLIC_AI_API_ENDPOINT=/api/ai/recommendations
NEXT_PUBLIC_AI_API_KEY=your_api_key_for_frontend
```

### Service Priority

The system tries AI services in this order:
1. **OpenAI GPT-4** (highest quality)
2. **Anthropic Claude** (alternative perspective)
3. **Local AI** (privacy-focused)
4. **Fallback Rules** (reliable backup)

## Benefits Over Hard-Coded System

### 🎯 **Personalization**
- **Before**: Static recommendations based on fixed rules
- **After**: Dynamic recommendations based on individual responses

### 🧠 **Intelligence**
- **Before**: Simple if-then logic
- **After**: Pattern recognition and correlation analysis

### 📈 **Scalability**
- **Before**: Manual updates required for new scenarios
- **After**: Automatically adapts to new patterns and insights

### 🔄 **Flexibility**
- **Before**: Fixed recommendation structure
- **After**: Adaptive recommendations with confidence scoring

### 📚 **Integration**
- **Before**: Static article links
- **After**: Dynamic article fetching based on AI analysis

## Fallback System

When AI services are unavailable, the system provides:

1. **Rule-Based Recommendations**: Simple if-then logic for common scenarios
2. **Basic Scoring**: Calculated scores based on key factors
3. **Generic Insights**: Standard sleep health advice
4. **Error Handling**: Graceful degradation with user-friendly messages

## Future Enhancements

### 🎯 **Advanced Features**
- **Machine Learning Models**: Custom-trained models for sleep assessment
- **Predictive Analytics**: Forecast sleep quality trends
- **Behavioral Analysis**: Deep pattern recognition
- **Personalized Learning**: Adapt recommendations based on user feedback

### 🔗 **Integration Opportunities**
- **Wearable Devices**: Integration with sleep trackers
- **Health Apps**: Connect with fitness and health applications
- **Telemedicine**: Integration with healthcare providers
- **Community Features**: Anonymous pattern sharing and insights

### 📊 **Analytics Dashboard**
- **User Progress Tracking**: Visual progress over time
- **Recommendation Effectiveness**: Measure impact of suggestions
- **Population Insights**: Aggregate anonymous data for research
- **A/B Testing**: Test different recommendation strategies

## Security & Privacy

### 🔒 **Data Protection**
- **Local Processing**: Sensitive data processed locally when possible
- **Encrypted Storage**: Assessment results encrypted in localStorage
- **API Security**: Secure API endpoints with authentication
- **Data Minimization**: Only necessary data sent to AI services

### 🛡️ **Privacy Features**
- **Anonymous Processing**: No personal identifiers sent to AI services
- **Data Retention**: Limited storage of assessment results
- **User Control**: Users can delete their assessment history
- **Transparency**: Clear information about data usage

## Troubleshooting

### Common Issues

1. **AI Service Unavailable**
   - Check API keys and network connectivity
   - Verify service endpoints are accessible
   - System will automatically fall back to rule-based recommendations

2. **Poor Recommendation Quality**
   - Review AI service configuration
   - Check prompt engineering
   - Verify assessment data quality

3. **Article Integration Issues**
   - Check Strapi API connectivity
   - Verify category mapping
   - Review article availability

### Debug Mode

Enable debug logging by setting:
```bash
NEXT_PUBLIC_DEBUG_AI=true
```

This will log detailed information about AI requests, responses, and fallback behavior.

## Conclusion

The AI-powered assessment system provides a significant upgrade over hard-coded calculations, offering personalized, intelligent, and scalable recommendations. The multi-service architecture ensures reliability while the fallback system guarantees functionality even when AI services are unavailable.

This system transforms the assessment from a static questionnaire into a dynamic, intelligent tool that adapts to each user's unique situation and provides truly personalized sleep health guidance.
