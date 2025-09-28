# 睡眠评估系统文档

## 概述

睡眠评估系统是一个基于科学规则的评估引擎，用于分析用户的睡眠状况并提供个性化的改善建议。系统采用规则驱动的方法，不依赖AI，确保结果的一致性和可解释性。

## 系统架构

### 核心组件

1. **评估引擎** (`web/src/lib/static-assessment-engine.ts`)
   - 处理用户答案
   - 计算问题标签
   - 匹配相关手册

2. **数据层**
   - **计算函数** (`web/src/data/static-assessment-calculations.ts`)
   - **问题定义** (`web/src/data/static-assessment-questions.ts`)
   - **手册内容** (`web/src/data/static-assessment-booklets.ts`)

3. **用户界面**
   - **评估页面** (`web/src/app/[locale]/assessment/page.tsx`)
   - **结果展示** (`web/src/components/StaticAssessmentResults.tsx`)

## 数据流程

### 1. 问题收集
```
用户答案 → 问题验证 → 依赖检查 → 动态问题显示
```

### 2. 标签计算
```
答案数据 → 计算函数 → 条件评估 → 标签识别
```

### 3. 手册匹配
```
计算标签 → 手册查找 → 优先级排序 → 结果展示
```

## 核心功能

### 问题系统

#### 问题类型
- **single_choice**: 单选题
- **scale**: 数值范围选择
- **text**: 文本输入
- **email**: 邮箱输入
- **date**: 日期选择

#### 依赖系统
问题可以设置依赖条件，只有当依赖问题的答案匹配时才会显示：
```typescript
depends: {
  questionId: 'status',
  value: 'study'
}
```

#### 动态问题加载
系统会根据用户答案动态显示相关问题，确保问题流程的合理性。

### 计算引擎

#### 计算函数
系统提供多种计算函数来分析用户答案：

- `getSleepHours(attempted, actual)`: 计算睡眠时长
- `calcSleepEfficiency(attempted, actual)`: 计算睡眠效率
- `isHealthy(attempted, actual)`: 判断睡眠是否健康
- `isIdle(attempted, actual)`: 判断是否睡眠不足
- `isStimuli(attempted, actual)`: 判断是否有刺激因素
- `isAffected(attempted, actual)`: 判断是否受影响
- `calculateSleepQuality(attempted, actual)`: 计算睡眠质量
- `hasShiftWorkIssues(status, shiftwork)`: 判断倒班问题
- `hasStudentIssues(status, holiday, bedtimeearly)`: 判断学生问题

#### 函数返回格式
```typescript
interface CalculationResult {
  value: boolean | number;
  confidence: number;
  reasoning: string;
}
```

### 标签系统

#### 标签结构
```typescript
interface StaticIssue {
  id: string;
  name: string;
  text: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  calc: {
    type: 'function' | 'direct' | 'condition';
    question?: string;
    value?: string;
    func?: string;
    input?: string[];
    conditions?: string[];
  };
  interventions: string[];
  severity: 'mild' | 'moderate' | 'severe';
}
```

#### 标签计算
标签通过以下方式计算：
1. **函数计算**: 调用计算函数
2. **直接匹配**: 直接比较答案值
3. **条件评估**: 评估复杂条件

### 手册系统

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
  content: {
    summary: string;
    problem: string;
    solution: string;
    steps: string[];
    tips: string[];
    warnings?: string[];
    resources?: Resource[];
  };
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedOutcome: string;
}
```

#### 手册匹配
系统根据计算的标签匹配相关手册，并按优先级排序显示。

## 用户界面

### 评估流程

1. **首页** (`landing`)
   - 系统介绍
   - 评估类别说明
   - 开始评估按钮
   - 测试模式选项

2. **问题页面** (`questions`)
   - 动态问题显示
   - 进度指示器
   - 问题导航
   - 答案验证

3. **结果页面** (`results`)
   - 标签展示
   - 手册推荐
   - 调试信息
   - 评估摘要

### 测试模式

系统提供三种预设测试场景：
- **中度睡眠问题**: 常见睡眠问题
- **严重睡眠问题**: 严重睡眠障碍
- **良好睡眠习惯**: 健康睡眠模式

## 技术实现

### 状态管理
```typescript
const [currentScreen, setCurrentScreen] = useState<'landing' | 'questions' | 'results'>('landing');
const [answers, setAnswers] = useState<Record<string, string>>({});
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [visibleQuestions, setVisibleQuestions] = useState<AssessmentQuestion[]>([]);
const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
const [isTestMode, setIsTestMode] = useState(false);
```

### 问题处理
```typescript
const handleAnswerSelect = (questionId: string, answer: string) => {
  setAnswers(prev => ({ ...prev, [questionId]: answer }));
};
```

### 评估处理
```typescript
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

## 数据文件

### 计算函数 (`static-assessment-calculations.ts`)
包含所有用于分析睡眠数据的计算函数。

### 问题定义 (`static-assessment-questions.ts`)
定义所有评估问题，包括问题类型、选项、依赖关系等。

### 手册内容 (`static-assessment-booklets.ts`)
包含所有睡眠改善手册的详细内容。

## 扩展指南

### 添加新问题
1. 在 `static-assessment-questions.ts` 中添加问题定义
2. 更新相关部分的 `questions` 数组
3. 测试问题依赖关系

### 添加新标签
1. 在 `static-assessment-questions.ts` 中添加标签定义
2. 定义计算逻辑
3. 测试标签计算

### 添加新手册
1. 在 `static-assessment-booklets.ts` 中添加手册定义
2. 关联到相应标签
3. 测试手册匹配

### 添加新计算函数
1. 在 `static-assessment-calculations.ts` 中添加函数
2. 更新函数导出
3. 在标签中使用新函数

## 调试功能

系统提供丰富的调试信息：
- 计算的标签列表
- 匹配的手册数量
- 可用的标签和手册
- 用户答案统计

## 性能优化

- 动态问题加载减少不必要的渲染
- 计算函数缓存避免重复计算
- 手册内容按需加载
- 状态管理优化减少重渲染

## 错误处理

- 问题依赖验证
- 计算函数错误捕获
- 数据完整性检查
- 用户友好的错误提示

## 未来改进

1. **数据库集成**: 将静态数据迁移到数据库
2. **用户历史**: 保存用户评估历史
3. **进度跟踪**: 跟踪用户改善进度
4. **个性化推荐**: 基于历史数据优化推荐
5. **多语言支持**: 扩展语言支持
6. **移动端优化**: 优化移动端体验

## 维护指南

### 定期检查
- 验证计算函数准确性
- 检查问题依赖关系
- 更新手册内容
- 测试系统性能

### 数据更新
- 更新科学依据
- 添加新的睡眠研究
- 优化计算算法
- 完善手册内容

### 系统监控
- 监控用户使用情况
- 分析评估结果分布
- 识别系统问题
- 优化用户体验
