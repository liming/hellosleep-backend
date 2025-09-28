# 静态评估引擎 (Static Assessment Engine)

## 概述

静态评估引擎是一个基于规则的评估系统，它使用预定义的逻辑来计算评估结果，而不是依赖AI。该系统遵循以下工作流程：

1. 用户完成评估问卷
2. 使用 `prompts/calculate.js` 中的函数计算特定结果
3. 将计算结果映射到 `prompts/questions_tags.json` 中的标签
4. 使用标签在 `prompts/booklets.json` 中查找匹配的手册
5. 在评估结果页面显示这些手册

## 文件结构

```
web/src/lib/
├── static-assessment-engine.ts          # 核心评估引擎
├── static-assessment-database.ts        # 数据库迁移工具
└── types/
    └── calculate.d.ts                   # 计算函数类型定义

web/src/components/
└── StaticAssessmentResults.tsx         # 评估结果展示组件

web/src/app/static-assessment/
├── page.tsx                            # 测试页面
└── migration/
    └── page.tsx                        # 迁移工具页面

prompts/
├── calculate.js                        # 计算函数
├── questions_tags.json                 # 问题标签映射
└── booklets.json                       # 手册数据
```

## 核心组件

### StaticAssessmentEngine

主要的评估引擎类，提供以下功能：

- `processAssessment(answers)`: 处理评估答案并返回结果
- `calculateTags(answers)`: 基于答案计算标签
- `findBookletsByIssues(issues)`: 根据问题查找手册
- `validateAnswers(answers)`: 验证答案完整性
- `getProgressPercentage(answers)`: 获取进度百分比

### 计算函数 (calculate.js)

包含以下核心计算函数：

- `getSleepHours()`: 计算睡眠时间
- `calcSleepEfficiency()`: 计算睡眠效率
- `isHealthy()`: 判断健康状态
- `isIdle()`: 判断空闲状态
- `isStimuli()`: 判断刺激状态
- `isAffected()`: 判断受影响状态

### 标签系统 (questions_tags.json)

定义了问题到标签的映射规则：

```json
{
  "name": "tag_name",
  "text": "标签显示文本",
  "calc": {
    "question": "question_id",
    "value": "expected_value"
  }
}
```

或者使用函数计算：

```json
{
  "name": "tag_name",
  "text": "标签显示文本",
  "calc": {
    "func": "functionName",
    "input": ["param1", "param2"]
  }
}
```

### 手册系统 (booklets.json)

包含个性化建议内容：

```json
{
  "id": "booklet_id",
  "tag": "matching_tag",
  "fact": {
    "name": "fact_name",
    "description": {
      "zh": "中文描述"
    }
  },
  "content": [
    {
      "lang": "zh",
      "text": "建议内容"
    }
  ]
}
```

## 使用方法

### 1. 基本使用

```typescript
import { staticAssessmentEngine } from '@/lib/static-assessment-engine';

// 处理评估答案
const answers = {
  status: 'work',
  sleepregular: 'no',
  sport: 'little',
  // ... 更多答案
};

const result = staticAssessmentEngine.processAssessment(answers);
console.log('计算的问题:', result.calculatedIssues);
console.log('匹配的手册:', result.matchedBooklets);
```

### 2. 在React组件中使用

```typescript
import StaticAssessmentResults from '@/components/StaticAssessmentResults';

function AssessmentPage() {
  const [answers, setAnswers] = useState({});
  
  return (
    <StaticAssessmentResults 
      answers={answers} 
      onBack={() => setShowResults(false)} 
    />
  );
}
```

### 3. 测试页面

访问 `/static-assessment` 查看测试页面，可以：
- 填写示例问题
- 查看实时答案
- 生成评估结果
- 查看匹配的手册

## 数据库迁移

### 迁移工具

访问 `/static-assessment/migration` 使用迁移工具：

1. **生成SQL迁移脚本**: 创建数据库表结构和数据
2. **生成Strapi迁移**: 为Strapi CMS生成迁移数据
3. **生成TypeScript接口**: 创建数据库模型类型定义
4. **导出原始数据**: 导出JSON格式的原始数据

### 数据库结构

#### assessment_tags 表
```sql
CREATE TABLE assessment_tags (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  text VARCHAR(500) NOT NULL,
  calc_type ENUM('question', 'function') NOT NULL,
  calc_question VARCHAR(255),
  calc_value VARCHAR(255),
  calc_function VARCHAR(255),
  calc_input JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### assessment_booklets 表
```sql
CREATE TABLE assessment_booklets (
  id VARCHAR(255) PRIMARY KEY,
  tag VARCHAR(255) NOT NULL,
  fact_name VARCHAR(255) NOT NULL,
  fact_description TEXT NOT NULL,
  content JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tag) REFERENCES assessment_tags(name) ON DELETE CASCADE
);
```

#### assessment_calculation_functions 表
```sql
CREATE TABLE assessment_calculation_functions (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(500) NOT NULL,
  parameters JSON NOT NULL,
  return_type ENUM('boolean', 'number') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 扩展和定制

### 添加新的计算函数

1. 在 `prompts/calculate.js` 中添加新函数
2. 在 `web/src/types/calculate.d.ts` 中添加类型定义
3. 在 `questions_tags.json` 中创建使用该函数的标签

### 添加新的标签

在 `questions_tags.json` 的 `tags` 数组中添加新标签：

```json
{
  "name": "new_tag",
  "text": "新标签",
  "calc": {
    "question": "question_id",
    "value": "expected_value"
  }
}
```

### 添加新的手册

在 `booklets.json` 中添加新手册：

```json
{
  "id": "new_booklet_id",
  "tag": "matching_tag",
  "fact": {
    "name": "fact_name",
    "description": {
      "zh": "中文描述"
    }
  },
  "content": [
    {
      "lang": "zh",
      "text": "建议内容"
    }
  ]
}
```

## 性能考虑

- 所有数据都存储在内存中，确保快速访问
- 计算函数使用预定义的逻辑，无需网络请求
- 结果缓存使用localStorage，避免重复计算

## 错误处理

- 函数调用错误会被捕获并记录到控制台
- 缺失的答案会被标记为无效
- 未找到的手册会显示空结果

## 未来改进

1. **数据库集成**: 将静态数据迁移到数据库
2. **动态配置**: 支持运行时修改计算规则
3. **多语言支持**: 扩展国际化支持
4. **A/B测试**: 支持不同版本的评估逻辑
5. **分析功能**: 添加评估结果分析功能
