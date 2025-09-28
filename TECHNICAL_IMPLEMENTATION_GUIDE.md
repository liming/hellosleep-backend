# 技术实现指南

## 开发环境设置

### 前置要求
- Node.js 18+
- npm 或 yarn
- TypeScript 5.0+
- Next.js 15+
- Strapi 5+

### 项目结构
```
web/
├── src/
│   ├── app/[locale]/assessment/
│   │   └── page.tsx                 # 主评估页面
│   ├── components/
│   │   └── StaticAssessmentResults.tsx  # 结果展示组件
│   ├── data/
│   │   ├── static-assessment-questions.ts     # 问题定义和标签
│   │   └── assessment-recommendations.ts      # 推荐系统
│   └── lib/
│       ├── static-assessment-engine.ts        # 评估引擎
│       └── assessment-engine.ts               # 传统评估引擎
```

## 核心组件详解

### 1. 静态评估引擎 (`static-assessment-engine.ts`)

#### 主要功能
- 处理用户答案
- 计算问题标签
- 生成个性化推荐
- 提供评估结果

#### 核心方法
```typescript
class StaticAssessmentEngine {
  // 处理评估
  processAssessment(answers: Record<string, string>): AssessmentResult
  
  // 计算标签
  calculateTags(answers: Record<string, string>): Tag[]
  
  // 评估标签条件
  evaluateTag(tag: StaticTag, answers: Record<string, string>): boolean
}
```

#### 使用示例
```typescript
import { staticAssessmentEngine } from '@/lib/static-assessment-engine';

const answers = {
  'status': 'work',
  'sleepregular': 'no',
  'hourstofallinsleep': '6',
  // ... 更多答案
};

const result = staticAssessmentEngine.processAssessment(answers);
console.log('计算的标签:', result.calculatedTags);
console.log('推荐内容:', result.calculatedTags.map(tag => tag.recommendation));
```

### 2. 问题系统 (`static-assessment-questions.ts`)

#### 问题结构
```typescript
interface StaticQuestion {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'scale' | 'text' | 'number' | 'email' | 'date' | 'time';
  category: 'basic_info' | 'sleep_habits' | 'lifestyle' | 'work_study' | 'attitude' | 'environment';
  required: boolean;
  options?: Array<{
    id?: string;
    value: string;
    text: string;
    score?: number;
  }>;
  depends?: {
    questionId: string;
    value: string;
  };
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  weight?: number;
  hint?: string;
}
```

#### 标签系统
```typescript
interface StaticTag {
  name: string;
  text: string;
  description: string;
  category: 'sleep' | 'lifestyle' | 'work' | 'student' | 'special' | 'behavior' | 'environment';
  priority: 'high' | 'medium' | 'low';
  calc: {
    type: 'simple' | 'function' | 'complex';
    question?: string;
    value?: string;
    func?: string;
    input?: string[];
    conditions?: Array<{
      question: string;
      value: string;
      operator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
    }>;
  };
  severity: 'mild' | 'moderate' | 'severe';
  recommendation: {
    title: string;
    content: string;
    tutorialLink?: string;
  };
}
```

### 3. 推荐系统 (`assessment-recommendations.ts`)

#### 推荐结构
```typescript
interface Recommendation {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  tutorialLink?: string;
  conditions: Array<{
    question: string;
    value: string;
    operator?: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
  }>;
}
```

## 数据流程

### 1. 问题收集
```
用户答案 → 问题验证 → 依赖检查 → 动态问题显示
```

### 2. 标签计算
```
用户答案 → 标签条件评估 → 标签匹配 → 推荐生成
```

### 3. 结果展示
```
计算标签 → 推荐排序 → 结果展示 → 用户反馈
```

## 标签计算逻辑

### 简单标签计算
```typescript
// 基于单个问题答案的简单计算
{
  type: 'simple',
  question: 'sleepregular',
  value: 'no'
}
```

### 函数标签计算
```typescript
// 基于计算函数的复杂逻辑
{
  type: 'function',
  func: 'calcSleepEfficiency',
  input: ['sleeptime', 'getuptime', 'hourstosleep', 'hourstofallinsleep']
}
```

### 复杂条件计算
```typescript
// 基于多个条件的复杂判断
{
  type: 'complex',
  conditions: [
    { question: 'status', value: 'study' },
    { question: 'holiday', value: 'yes' }
  ]
}
```

## 推荐系统

### 推荐匹配
推荐系统基于计算出的标签自动匹配相关建议：

1. **睡眠相关标签** → 睡眠改善建议
2. **生活方式标签** → 生活习惯建议  
3. **工作学习标签** → 工作学习建议
4. **特殊人群标签** → 针对性建议
5. **行为问题标签** → 行为改善建议
6. **环境问题标签** → 环境优化建议

### 推荐优先级
- **高优先级**: 严重影响睡眠的问题
- **中优先级**: 一般影响睡眠的问题
- **低优先级**: 轻微影响睡眠的问题

## 添加新标签

### 1. 在 `static-assessment-questions.ts` 中添加标签定义
```typescript
export const staticTags: StaticTag[] = [
  // ... existing tags
  {
    name: 'new_tag',
    text: '新标签',
    description: '标签描述',
    category: 'sleep',
    priority: 'high',
    calc: {
      type: 'simple',
      question: 'question_id',
      value: 'expected_value'
    },
    severity: 'moderate',
    recommendation: {
      title: '改善建议标题',
      content: '详细的改善建议内容...',
      tutorialLink: '/article/documentId'
    }
  }
];
```

### 2. 测试标签计算
```typescript
// 在测试文件中验证标签计算
const testAnswers = {
  'question_id': 'expected_value'
};

const result = staticAssessmentEngine.processAssessment(testAnswers);
expect(result.calculatedTags).toContainEqual(
  expect.objectContaining({ name: 'new_tag' })
);
```

## 添加新问题

### 1. 在 `static-assessment-questions.ts` 中添加问题定义
```typescript
export const staticQuestions: StaticQuestion[] = [
  // ... existing questions
  {
    id: 'new_question',
    text: '新问题文本',
    type: 'single_choice',
    category: 'sleep_habits',
    required: true,
    options: [
      { id: 'option1', value: 'value1', text: '选项1', score: 1 },
      { id: 'option2', value: 'value2', text: '选项2', score: 2 }
    ]
  }
];
```

### 2. 更新相关标签的计算逻辑
```typescript
// 如果新问题影响现有标签，更新计算条件
{
  name: 'existing_tag',
  calc: {
    type: 'complex',
    conditions: [
      { question: 'existing_question', value: 'value' },
      { question: 'new_question', value: 'new_value' }  // 新增条件
    ]
  }
}
```

## 性能优化

### 1. 懒加载组件
```typescript
// 懒加载结果组件
const StaticAssessmentResults = lazy(() => import('./StaticAssessmentResults'));
```

### 2. 缓存计算结果
```typescript
// 缓存标签计算结果
private tagCache = new Map<string, Tag[]>();

calculateTags(answers: Record<string, string>): Tag[] {
  const cacheKey = JSON.stringify(answers);
  if (this.tagCache.has(cacheKey)) {
    return this.tagCache.get(cacheKey)!;
  }
  
  const tags = this.performCalculation(answers);
  this.tagCache.set(cacheKey, tags);
  return tags;
}
```

## 测试策略

### 1. 单元测试
```typescript
describe('StaticAssessmentEngine', () => {
  test('should calculate tags correctly', () => {
    const answers = { 'sleepregular': 'no' };
    const result = staticAssessmentEngine.processAssessment(answers);
    
    expect(result.calculatedTags.length).toBeGreaterThan(0);
    expect(result.calculatedTags[0]).toHaveProperty('recommendation');
  });
});
```

### 2. 集成测试
```typescript
describe('Assessment Flow', () => {
  test('should complete full assessment flow', async () => {
    const answers = generateTestAnswers();
    const result = staticAssessmentEngine.processAssessment(answers);
    
    expect(result.calculatedTags.length).toBeGreaterThan(0);
    expect(result.completedAt).toBeInstanceOf(Date);
  });
});
```

## 部署配置

### 1. 环境变量
```bash
# .env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token
```

### 2. 构建配置
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  }
}
```

## 故障排除

### 常见问题

1. **标签计算错误**
   - 检查问题ID是否匹配
   - 验证计算函数是否存在
   - 确认答案格式正确

2. **推荐不显示**
   - 检查标签是否被正确计算
   - 验证推荐条件是否匹配
   - 确认推荐内容是否存在

3. **性能问题**
   - 启用标签计算缓存
   - 优化计算函数复杂度
   - 使用懒加载组件

### 调试工具
```typescript
// 启用调试模式
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Assessment answers:', answers);
  console.log('Calculated tags:', result.calculatedTags);
}
```

## 最佳实践

1. **标签设计**
   - 保持标签名称简洁明确
   - 使用有意义的描述
   - 合理设置优先级和严重程度

2. **推荐内容**
   - 提供具体可执行的建议
   - 包含相关的教程链接
   - 根据严重程度调整内容详细程度

3. **问题设计**
   - 问题文本清晰易懂
   - 选项覆盖全面
   - 合理设置依赖关系

4. **性能考虑**
   - 避免复杂的计算函数
   - 使用缓存减少重复计算
   - 合理设置问题数量