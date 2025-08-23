# 静态评估引擎使用指南

## 快速开始

### 1. 访问测试页面

访问 `/static-assessment` 来测试静态评估引擎的基本功能。

### 2. 查看演示

访问 `/static-assessment/demo` 查看完整的演示，包括：
- 预设场景测试
- 引擎功能测试
- API 接口测试

### 3. 生成迁移文件

访问 `/static-assessment/migration` 生成数据库迁移文件。

## 核心功能

### 评估处理

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
console.log('标签:', result.calculatedTags);
console.log('手册:', result.matchedBooklets);
```

### 结果展示

```typescript
import StaticAssessmentResults from '@/components/StaticAssessmentResults';

function MyComponent() {
  const [answers, setAnswers] = useState({});
  
  return (
    <StaticAssessmentResults 
      answers={answers} 
      onBack={() => setShowResults(false)} 
    />
  );
}
```

## API 使用

### 发送评估请求

```bash
curl -X POST /api/static-assessment \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "status": "work",
      "sleepregular": "no",
      "sport": "little"
    }
  }'
```

### 响应格式

```json
{
  "success": true,
  "data": {
    "calculatedTags": ["unhealthy", "stress"],
    "matchedBooklets": [
      {
        "id": "booklet_id",
        "tag": "unhealthy",
        "factName": "fact_name",
        "factDescription": "健康的生活方式",
        "content": [...]
      }
    ],
    "completedAt": "2024-01-01T00:00:00.000Z",
    "summary": {
      "totalAnswers": 10,
      "totalTags": 2,
      "totalBooklets": 3
    }
  }
}
```

## 数据库迁移

### 生成 SQL 迁移

```typescript
import { staticAssessmentDatabase } from '@/lib/static-assessment-database';

const sql = staticAssessmentDatabase.generateSQLMigration();
console.log(sql);
```

### 生成 Strapi 迁移

```typescript
const strapiData = staticAssessmentDatabase.generateStrapiMigration();
console.log(JSON.stringify(strapiData, null, 2));
```

## 测试

### 运行测试

```typescript
import { runStaticAssessmentTests } from '@/lib/static-assessment-test';

const results = runStaticAssessmentTests();
console.log('测试结果:', results);
```

### 测试场景

系统包含以下测试场景：
1. 孕期用户 - 睡眠效率低
2. 学生用户 - 假期综合症
3. 工作用户 - 压力大且不健康
4. 产后用户 - 放弃努力
5. 噪音问题用户

## 配置和定制

### 添加新标签

在 `prompts/questions_tags.json` 中添加：

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

### 添加新手册

在 `prompts/booklets.json` 中添加：

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

### 添加计算函数

1. 在 `prompts/calculate.js` 中添加函数
2. 在 `web/src/types/calculate.d.ts` 中添加类型定义
3. 在标签配置中使用新函数

## 性能优化

### 缓存策略

- 评估结果缓存在 localStorage
- 计算函数预加载到内存
- 标签和手册数据静态加载

### 错误处理

```typescript
try {
  const result = staticAssessmentEngine.processAssessment(answers);
  // 处理结果
} catch (error) {
  console.error('评估处理错误:', error);
  // 错误处理
}
```

## 集成到现有系统

### 使用静态评估

```typescript
// 使用静态评估引擎
const staticResult = staticAssessmentEngine.processAssessment(answers);

// 处理结果
console.log('计算的标签:', staticResult.calculatedTags);
console.log('匹配的手册:', staticResult.matchedBooklets);
```

### 结果验证

```typescript
// 验证评估结果
const staticResult = staticAssessmentEngine.processAssessment(answers);

// 检查是否有匹配的手册
if (staticResult.matchedBooklets.length === 0) {
  console.log('没有找到匹配的手册，可能需要检查标签计算逻辑');
} else {
  console.log(`找到 ${staticResult.matchedBooklets.length} 个匹配的手册`);
}
```

## 监控和分析

### 性能监控

```typescript
// 记录处理时间
const startTime = performance.now();
const result = staticAssessmentEngine.processAssessment(answers);
const endTime = performance.now();
console.log(`处理时间: ${endTime - startTime}ms`);
```

### 结果分析

```typescript
// 分析标签分布
const tagDistribution = {};
result.calculatedTags.forEach(tag => {
  tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
});
console.log('标签分布:', tagDistribution);
```

## 故障排除

### 常见问题

1. **没有匹配的手册**
   - 检查标签计算是否正确
   - 验证手册标签是否匹配

2. **计算函数错误**
   - 检查函数参数是否正确
   - 验证输入数据类型

3. **性能问题**
   - 检查数据量是否过大
   - 考虑分批处理

### 调试模式

```typescript
// 启用详细日志
console.log('输入答案:', answers);
console.log('计算的标签:', result.calculatedTags);
console.log('匹配的手册:', result.matchedBooklets);
```

## 最佳实践

1. **数据验证**: 始终验证输入答案的完整性
2. **错误处理**: 实现适当的错误处理机制
3. **性能监控**: 监控评估处理性能
4. **用户反馈**: 收集用户对建议的反馈
5. **定期更新**: 定期更新标签和手册内容

## 支持

如有问题，请查看：
- `STATIC_ASSESSMENT_ENGINE.md` - 详细技术文档
- 测试页面 - 功能演示
- 控制台日志 - 调试信息
