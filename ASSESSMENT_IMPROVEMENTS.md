# Sleep Assessment Improvements

## Overview

The sleep assessment system has been significantly enhanced to incorporate evidence-based recommendations from the existing `prompts/booklets.json` data. This ensures that AI-generated results are grounded in proven medical advice and therapeutic approaches.

**Key Philosophy**: HelloSleep focuses on solving root causes rather than scoring sleep quality. All scoring mechanisms have been removed in favor of urgency levels and evidence-based recommendations.

## Key Improvements

### 1. Evidence-Based Recommendation Mapping

**File**: `web/src/data/assessment-booklets-mapping.ts`

- **Booklet Facts Extraction**: Converted 25+ booklet entries from the original JSON into structured `BookletFact` objects
- **Answer-to-Fact Mapping**: Created intelligent mapping function that connects specific assessment answers to relevant booklet facts
- **Prioritization System**: Implemented priority scoring based on severity and impact of different sleep issues

**Key Facts Included**:
- Sleep efficiency (`sleep_non_efficiency`)
- Irregular wake times (`getup_irregularly`)
- Noise issues (`neighbour_noise`, `roommate_noise`, `bedmate_snore`)
- Lifestyle factors (`unhealthy`, `idle`, `boring`)
- Work/study impacts (`distraction`, `unsociable`)
- Attitude issues (`complain`, `susceptible`, `medicine`)
- Special populations (`prenatal`, `postnatal`, `study_uni`, `study_highschool`)

### 2. Enhanced AI Assessment Engine

**File**: `web/src/lib/ai-assessment-engine.ts`

- **Booklet Integration**: AI engine now uses booklet facts for both AI prompts and fallback recommendations
- **Evidence-Based Fallbacks**: When AI services are unavailable, the system generates recommendations based on the mapped booklet facts
- **Structured Actions**: Each recommendation includes specific, actionable steps with difficulty levels and time requirements
- **Tutorial Links**: Recommendations include links to relevant tutorial articles when available

**New Features**:
- Fact-to-recommendation conversion
- Category mapping (sleephabit, lifestyle, workstudy, attitude)
- Priority-based action generation
- Correlation and risk factor identification

### 3. Improved AI Prompts

**File**: `web/src/app/api/ai/recommendations/route.ts`

- **Chinese Language**: Prompts are now in Chinese for better understanding
- **Evidence Integration**: AI prompts include relevant booklet facts as context
- **Structured Output**: Requests specific JSON format for consistent results
- **Tutorial Integration**: Encourages AI to reference existing tutorial content

### 4. Sleep Quality Scoring Removal

**Philosophy**: HelloSleep focuses on solving root causes, not scoring sleep quality.

**Changes Made**:
- Removed `overallScore` from all interfaces and responses
- Replaced scoring with urgency levels (`low`, `medium`, `high`)
- Updated UI to show urgency status instead of numerical scores
- Modified progress tracking to compare urgency improvements rather than score changes

**Files Updated**:
- `web/src/lib/ai-assessment-engine.ts` - Removed scoring from AI recommendations
- `web/src/app/api/ai/recommendations/route.ts` - Updated API responses to exclude scores
- `web/src/lib/enhanced-assessment-engine.ts` - Replaced score comparisons with urgency tracking
- `web/src/app/[locale]/assessment/page.tsx` - Removed score display, added urgency indicators

### 5. Test Mode Enhancement

**File**: `web/src/app/[locale]/assessment/page.tsx`

- **Multiple Scenarios**: Three different test scenarios (moderate, severe, good habits)
- **Visual Indicators**: Clear test mode badges throughout the assessment
- **Scenario Selection**: Easy access to different test cases for comprehensive testing

## How It Works

### 1. Answer Analysis
```typescript
const relevantFacts = mapAnswersToBookletFacts(answers);
const prioritizedFacts = prioritizeBookletFacts(relevantFacts, answers);
```

### 2. Fact Mapping Examples
- `getupregular: 'no'` → `getup_irregularly` fact → "按时早起" recommendation
- `sport: 'little'` + `sunshine: 'little'` → `unhealthy` fact → "健康的生活方式" recommendation
- `medicine: 'yes'` → `medicine` fact → "药物" guidance with high priority

### 3. Recommendation Generation
Each booklet fact is converted to a structured recommendation with:
- **Title**: Clear, actionable heading
- **Description**: Evidence-based explanation from booklet content
- **Priority**: High/medium/low based on impact
- **Actions**: Specific steps with difficulty and time estimates
- **Tutorial Links**: References to existing tutorial articles

## Benefits

### 1. **Evidence-Based**: All recommendations are grounded in existing medical knowledge
### 2. **Personalized**: Mapping system ensures relevant facts are selected based on user answers
### 3. **Actionable**: Each recommendation includes specific, measurable actions
### 4. **Consistent**: Both AI and fallback systems use the same evidence base
### 5. **Integrated**: Seamlessly connects to existing tutorial content
### 6. **Testable**: Multiple test scenarios for easy validation

## Testing

Use the test mode buttons on the assessment landing page:

1. **🧪 测试场景1: 中度睡眠问题** - Common sleep issues
2. **🧪 测试场景2: 严重睡眠问题** - Severe insomnia with multiple factors
3. **🧪 测试场景3: 良好睡眠习惯** - Good habits with minor issues

Each scenario will generate different booklet facts and recommendations based on the specific answer patterns.

## Future Enhancements

1. **Dynamic Tutorial Fetching**: Automatically fetch and display tutorial content
2. **Progress Tracking**: Monitor user progress on recommendations
3. **Adaptive Learning**: Improve fact mapping based on user feedback
4. **Multilingual Support**: Extend booklet facts to other languages
5. **Professional Review**: Allow sleep professionals to validate and update recommendations

## Technical Notes

- **Modular Design**: Booklet mapping is separate from AI engine for easy maintenance
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Graceful fallbacks when booklet facts don't match
- **Performance**: Efficient mapping algorithms with minimal overhead
- **Extensibility**: Easy to add new facts and mapping rules
