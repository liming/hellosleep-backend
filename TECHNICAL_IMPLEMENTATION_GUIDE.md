# 技术实现指南

## 开发环境设置

### 前置要求
- Node.js 18+
- npm 或 yarn
- TypeScript 5.0+

### 项目结构
```
web/
├── src/
│   ├── app/[locale]/assessment/
│   │   └── page.tsx                 # 主评估页面
│   ├── components/
│   │   └── StaticAssessmentResults.tsx  # 结果展示组件
│   ├── data/
│   │   ├── static-assessment-calculations.ts  # 计算函数
│   │   ├── static-assessment-questions.ts     # 问题定义
│   │   └── static-assessment-booklets.ts      # 手册内容
│   └── lib/
│       └── static-assessment-engine.ts        # 评估引擎
```

## 核心组件详解

### 1. 评估引擎 (`static-assessment-engine.ts`)

#### 主要功能
- 处理用户答案
- 计算问题标签
- 匹配相关手册
- 生成评估结果

#### 核心方法
```typescript
class StaticAssessmentEngine {
  // 处理评估
  processAssessment(answers: Record<string, string>): AssessmentResult
  
  // 计算标签
  calculateTags(answers: Record<string, string>): string[]
  
  // 查找手册
  findBookletsByTags(tags: string[]): StaticBooklet[]
  
  // 评估标签条件
  evaluateTag(tag: StaticTag, answers: Record<string, string>): boolean
}
```

#### 使用示例
```typescript
import { staticAssessmentEngine } from '@/lib/static-assessment-engine';

const answers = {
  hourstosleep: '8',
  hourstofallinsleep: '6',
  sport: 'little'
};

const result = staticAssessmentEngine.processAssessment(answers);
console.log('Calculated tags:', result.calculatedTags);
console.log('Matched booklets:', result.matchedBooklets);
```

### 2. 计算函数 (`static-assessment-calculations.ts`)

#### 函数类型
- **睡眠分析函数**: 分析睡眠时长、效率等
- **生活方式函数**: 分析运动、压力等
- **特殊群体函数**: 分析学生、倒班工人等

#### 函数签名
```typescript
interface CalculationFunction {
  (params: any[]): CalculationResult;
}

interface CalculationResult {
  value: boolean | number;
  confidence: number;
  reasoning: string;
}
```

#### 添加新函数
```typescript
export function newCalculationFunction(param1: string, param2: number): CalculationResult {
  // 计算逻辑
  const result = someCalculation(param1, param2);
  
  return {
    value: result > threshold,
    confidence: 0.85,
    reasoning: `基于${param1}和${param2}的计算结果`
  };
}
```

### 3. 问题定义 (`static-assessment-questions.ts`)

#### 问题结构
```typescript
interface AssessmentQuestion {
  id: string;
  order: number;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  category: string;
  required: boolean;
  depends?: Dependency;
  hint?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}
```

#### 添加新问题
```typescript
export const assessmentQuestions: AssessmentQuestion[] = [
  // ... existing questions
  {
    id: 'new_question',
    order: 32,
    text: '新问题文本',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { id: 'option1', text: '选项1', value: 'value1' },
      { id: 'option2', text: '选项2', value: 'value2' }
    ]
  }
];
```

#### 依赖关系
```typescript
depends: {
  questionId: 'status',
  value: 'work'
}
```

### 4. 标签系统 (`static-assessment-questions.ts`)

#### 标签结构
```typescript
interface StaticTag {
  id: string;
  name: string;
  text: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  calc: TagCalculation;
  interventions: string[];
  severity: 'mild' | 'moderate' | 'severe';
}
```

#### 计算配置
```typescript
calc: {
  type: 'function',
  func: 'calculateSleepQuality',
  input: ['hourstosleep', 'hourstofallinsleep']
}
```

#### 添加新标签
```typescript
export const staticTags: StaticTag[] = [
  // ... existing tags
  {
    id: 'new_tag',
    name: 'new_tag',
    text: '新标签',
    description: '新标签描述',
    category: 'sleep',
    priority: 'medium',
    calc: {
      type: 'function',
      func: 'newCalculationFunction',
      input: ['param1', 'param2']
    },
    interventions: ['intervention1', 'intervention2'],
    severity: 'moderate'
  }
];
```

### 5. 手册系统 (`static-assessment-booklets.ts`)

#### 手册结构
```typescript
interface StaticBooklet {
  id: string;
  tag: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  severity: 'mild' | 'moderate' | 'severe';
  content: BookletContent;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedOutcome: string;
}
```

#### 内容结构
```typescript
content: {
  summary: '概述',
  problem: '问题分析',
  solution: '解决方案',
  steps: ['步骤1', '步骤2'],
  tips: ['建议1', '建议2'],
  warnings: ['警告1'],
  resources: [
    {
      title: '资源标题',
      description: '资源描述',
      url: 'https://example.com'
    }
  ]
}
```

#### 添加新手册
```typescript
export const staticBooklets: StaticBooklet[] = [
  // ... existing booklets
  {
    id: 'new_booklet',
    tag: 'new_tag',
    title: '新手册标题',
    description: '新手册描述',
    category: 'sleep',
    priority: 'medium',
    severity: 'moderate',
    content: {
      summary: '概述内容',
      problem: '问题分析',
      solution: '解决方案',
      steps: ['步骤1', '步骤2'],
      tips: ['建议1', '建议2']
    },
    estimatedTime: '2-3周',
    difficulty: 'medium',
    expectedOutcome: '预期效果'
  }
];
```

## 用户界面组件

### 1. 评估页面 (`page.tsx`)

#### 状态管理
```typescript
const [currentScreen, setCurrentScreen] = useState<'landing' | 'questions' | 'results'>('landing');
const [answers, setAnswers] = useState<Record<string, string>>({});
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [visibleQuestions, setVisibleQuestions] = useState<AssessmentQuestion[]>([]);
const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
```

#### 核心方法
```typescript
// 处理答案选择
const handleAnswerSelect = (questionId: string, answer: string) => {
  setAnswers(prev => ({ ...prev, [questionId]: answer }));
};

// 处理问题导航
const handleNextQuestion = async () => {
  if (currentQuestionIndex === visibleQuestions.length - 1) {
    await processAssessment();
  } else {
    setCurrentQuestionIndex(prev => prev + 1);
  }
};

// 处理评估处理
const processAssessment = async () => {
  setIsProcessing(true);
  try {
    const result = staticAssessmentEngine.processAssessment(answers);
    setAssessmentResult(result);
    setCurrentScreen('results');
  } catch (error) {
    console.error('Error processing assessment:', error);
  } finally {
    setIsProcessing(false);
  }
};
```

### 2. 结果展示组件 (`StaticAssessmentResults.tsx`)

#### 组件结构
```typescript
interface StaticAssessmentResultsProps {
  answers: Record<string, string>;
  onBack?: () => void;
}
```

#### 主要功能
- 显示计算的标签
- 展示匹配的手册
- 提供调试信息
- 显示评估摘要

## 测试指南

### 1. 单元测试

#### 测试计算函数
```typescript
import { calculateSleepQuality } from '@/data/static-assessment-calculations';

describe('calculateSleepQuality', () => {
  it('should return high quality for good sleep', () => {
    const result = calculateSleepQuality(8, 7.5);
    expect(result.value).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

#### 测试标签计算
```typescript
import { staticAssessmentEngine } from '@/lib/static-assessment-engine';

describe('Tag Calculation', () => {
  it('should calculate sleep_efficiency tag', () => {
    const answers = {
      hourstosleep: '8',
      hourstofallinsleep: '6'
    };
    const result = staticAssessmentEngine.processAssessment(answers);
    expect(result.calculatedTags).toContain('sleep_efficiency');
  });
});
```

### 2. 集成测试

#### 测试完整流程
```typescript
describe('Assessment Flow', () => {
  it('should process complete assessment', async () => {
    const answers = testScenarios.moderate;
    const result = staticAssessmentEngine.processAssessment(answers);
    
    expect(result.calculatedTags.length).toBeGreaterThan(0);
    expect(result.matchedBooklets.length).toBeGreaterThan(0);
    expect(result.completedAt).toBeInstanceOf(Date);
  });
});
```

### 3. 端到端测试

#### 测试用户界面
```typescript
describe('Assessment UI', () => {
  it('should complete assessment flow', async () => {
    // 访问评估页面
    await page.goto('/zh/assessment');
    
    // 开始评估
    await page.click('text=开始评估');
    
    // 回答问题
    await page.click('text=规律');
    await page.click('text=下一题');
    
    // 验证结果
    await expect(page.locator('text=评估结果')).toBeVisible();
  });
});
```

## 性能优化

### 1. 代码分割
```typescript
// 动态导入计算函数
const calculationFunctions = await import('@/data/static-assessment-calculations');
```

### 2. 缓存策略
```typescript
// 缓存计算结果
const resultCache = new Map<string, AssessmentResult>();

const getCachedResult = (answersKey: string) => {
  if (resultCache.has(answersKey)) {
    return resultCache.get(answersKey);
  }
  return null;
};
```

### 3. 懒加载
```typescript
// 懒加载手册内容
const BookletCard = lazy(() => import('./BookletCard'));
```

## 错误处理

### 1. 输入验证
```typescript
const validateAnswers = (answers: Record<string, string>) => {
  const errors: string[] = [];
  
  for (const [questionId, answer] of Object.entries(answers)) {
    if (!answer || answer.trim() === '') {
      errors.push(`问题 ${questionId} 缺少答案`);
    }
  }
  
  return errors;
};
```

### 2. 计算错误处理
```typescript
const safeCalculate = (func: Function, params: any[]) => {
  try {
    return func(...params);
  } catch (error) {
    console.error(`计算函数错误: ${func.name}`, error);
    return {
      value: false,
      confidence: 0,
      reasoning: '计算过程中出现错误'
    };
  }
};
```

### 3. 用户友好错误
```typescript
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className="error-container">
        <h2>出现错误</h2>
        <p>评估过程中出现错误，请刷新页面重试</p>
        <button onClick={() => window.location.reload()}>
          刷新页面
        </button>
      </div>
    );
  }
  
  return children;
};
```

## 部署指南

### 1. 构建配置
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "lint": "eslint src/**/*.{ts,tsx}"
  }
}
```

### 2. 环境变量
```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ASSESSMENT_VERSION=1.0.0
```

### 3. 部署检查清单
- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 性能测试通过
- [ ] 错误监控配置
- [ ] 用户反馈收集

## 维护指南

### 1. 日常维护
- 监控系统性能
- 检查错误日志
- 更新依赖包
- 备份数据文件

### 2. 定期更新
- 更新科学依据
- 优化计算算法
- 完善手册内容
- 改进用户界面

### 3. 问题排查
- 检查计算函数
- 验证数据完整性
- 分析用户反馈
- 优化系统性能
