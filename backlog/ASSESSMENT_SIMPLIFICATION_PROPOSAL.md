# Assessment 功能简化方案

## 一、现状分析

### 1.1 涉及文件清单

| 文件 | 行数 | 职责 |
|------|------|------|
| `web/src/app/[locale]/assessment/page.tsx` | 530 | 主页面，混合了数据获取、状态管理、多屏渲染 |
| `web/src/lib/static-assessment-engine.ts` | 263 | 评估引擎类（`StaticAssessmentEngine`） |
| `web/src/lib/assessment-data.ts` | 39 | 双数据源获取（Strapi API + 静态兜底） |
| `web/src/data/static-assessment-questions.ts` | 792 | 问题、标签、分区的静态定义 |
| `web/src/data/static-assessment-calculations.ts` | 329 | 计算函数（返回 `CalculationResult` 对象） |
| `web/src/data/assessment-test-scenarios.ts` | 102 | 测试预设场景 |
| `web/src/components/StaticAssessmentResults.tsx` | 197 | 结果展示（含调试信息） |
| `web/src/lib/assessment-tag-booklet-verification.ts` | 127 | 验证工具（仅供开发期使用） |
| `web/src/lib/static-assessment-test.ts` | — | 测试脚本 |
| `web/src/lib/assessment-flow-test.ts` | — | 流程测试脚本 |
| `web/src/app/api/assessment/data/route.ts` | 100 | 代理 Strapi 返回评估数据 |
| `web/src/app/api/assessment-seed-data/route.ts` | 18 | 向 Strapi 种入静态数据用 |
| `web/src/app/api/assessment-verify/route.ts` | — | 验证接口（开发用） |
| `web/src/app/api/assessment/test/route.ts` | — | 测试接口（开发用） |

以及 Strapi 端的三个 Collection Type：`assessment-tag`、`question`、`section`。

---

### 1.2 核心问题

#### 问题一：数据双存，静态数据才是真正的 source of truth

```
静态 TS 文件（真正的数据）
    ↓ seed-assessment.js
Strapi PostgreSQL（冗余副本）
    ↓ /api/assessment/data
前端（再转换一次格式）
    ↓ 若 API 失败
又回到静态 TS 文件（兜底）
```

静态 TS 文件定义了所有问题和标签，`seed-assessment.js` 把它同步进 Strapi，`/api/assessment/data` 再把 Strapi 的数据拉回来，失败时兜底还是用静态文件。整个 Strapi 层对评估数据而言没有带来额外价值。

#### 问题二：引擎类过度包装

`StaticAssessmentEngine` 是一个类，但核心逻辑只是一个纯函数：

```
answers → [遍历 tags，评估每个 calc 规则] → 激活的 tags[]
```

类中另外有 `saveResult`、`getSavedResults`、`getLatestResult`（localStorage 操作，未被主页面使用）、`validateAnswers`、`getProgressPercentage`（功能被 page.tsx 自己实现了）、`exportDataForDatabase`（仅供迁移脚本用）等方法，散落在各处且相互割裂。

#### 问题三：计算函数通过字符串名称间接调用

```typescript
// tag 定义中：
calc: { type: 'function', func: 'calcSleepEfficiency', input: [...] }

// 引擎执行时：
const func = calculationFunctions['calcSleepEfficiency']  // 字符串查找
(func as any)(...paramValues)
```

字符串→函数查找是一种间接层，破坏了类型安全，且 `CalculationResult` 对象（含 `confidence`、`reasoning` 字段）在引擎中只用了 `value` 字段，其余信息被丢弃。

#### 问题四：页面组件职责过重

`assessment/page.tsx` 单文件 530 行，承担了：
- 数据获取（`useEffect` + `fetchAssessmentData`）
- 测试场景加载（URL 参数 + localStorage）
- 问题流程状态机（`currentScreen`、`currentQuestionIndex`、`answers`）
- 三个屏幕的完整渲染（landing / questions / results）
- 测试模式按钮

#### 问题五：调试信息暴露在生产 UI

`StaticAssessmentResults.tsx` 末尾有一个常显的「调试信息」区块，展示所有可用标签列表，不适合出现在正式产品界面。

#### 问题六：开发工具混入生产代码路径

验证工具（`assessment-tag-booklet-verification.ts`）、测试接口（`/api/assessment/verify`、`/api/assessment/test`）、测试场景按钮在生产构建中都是可访问的。

---

## 二、简化目标

1. **消除 Strapi 评估数据同步层**：静态 TS 文件直接作为数据源，无需过 Strapi。
2. **引擎简化为纯函数**：去掉类封装，去掉字符串→函数间接调用。
3. **计算函数直接返回 `boolean`**：不再包装 `CalculationResult`。
4. **页面拆分为小组件**：每个屏幕独立组件文件。
5. **生产 UI 去除调试信息**：调试信息仅在 `NODE_ENV === 'development'` 时显示。
6. **开发工具与生产代码隔离**：测试场景、验证工具移入开发专用目录。

---

## 三、目标文件结构

```
web/src/
├── app/[locale]/assessment/
│   └── page.tsx                    # 薄壳，仅组合三个屏幕组件（~50 行）
│
├── components/assessment/
│   ├── LandingScreen.tsx           # 评估首页
│   ├── QuestionScreen.tsx          # 问题页（单题卡片 + 导航）
│   ├── ResultsScreen.tsx           # 结果页（标签 + 建议列表）
│   └── ProgressBar.tsx             # 进度条（可复用）
│
└── lib/
    ├── assessment.ts               # 纯函数：processAssessment + getVisibleQuestions
    └── assessment-data.ts          # 问题、标签、分区的静态定义（原 static-assessment-questions.ts）
```

删除的文件：

```
web/src/lib/static-assessment-engine.ts       ← 替换为纯函数
web/src/lib/assessment-data.ts                ← 重命名/合并
web/src/data/static-assessment-calculations.ts ← 内联到 assessment.ts
web/src/data/assessment-test-scenarios.ts     ← 移入 __dev__ 或 tests/
web/src/lib/assessment-tag-booklet-verification.ts ← 移入 tests/
web/src/lib/static-assessment-test.ts         ← 移入 tests/
web/src/lib/assessment-flow-test.ts           ← 移入 tests/
web/src/app/api/assessment/data/route.ts      ← 删除（不再需要 Strapi 数据）
web/src/app/api/assessment-seed-data/route.ts ← 删除（或保留为仅限 admin）
web/src/app/api/assessment-verify/route.ts    ← 删除（或移入 dev 工具）
web/src/app/api/assessment/test/route.ts      ← 删除（或移入 dev 工具）
```

Strapi 端可保留 `assessment-tag`、`question`、`section` Collection（其他功能可能用到），但评估流程不再依赖它们。

---

## 四、核心数据结构（保持不变）

```typescript
// 问题
interface Question {
  id: string;
  text: string;
  type: 'single_choice' | 'scale' | 'number' | 'time' | 'text' | 'email' | 'date';
  category: string;
  required: boolean;
  options?: Array<{ value: string; text: string }>;
  depends?: { questionId: string; value: string };
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hint?: string;
}

// 标签（激活后即代表一个睡眠问题 + 对应建议）
interface Tag {
  name: string;
  text: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  recommendation: {
    title: string;
    content: string;
    tutorialLink?: string;
  };
  // 替换 calc 字段：直接是判断函数
  match: (answers: Record<string, string>) => boolean;
}
```

---

## 五、核心逻辑简化

### 现在（字符串间接调用）

```typescript
// tag 定义（JSON-like 字符串引用）
calc: { type: 'function', func: 'calcSleepEfficiency', input: ['sleeptime', 'getuptime', ...] }

// 引擎执行（字符串查找 + any 类型转换）
const func = calculationFunctions[calc.func as keyof typeof calculationFunctions];
const result = (func as any)(...inputParams.map(p => answers[p]));
return typeof result === 'boolean' ? result : Boolean(result.value);
```

### 简化后（直接函数引用）

```typescript
// tag 定义（直接嵌入判断逻辑）
{
  name: 'sleep_inefficiency',
  text: '睡眠效率低',
  priority: 'high',
  match: (answers) => {
    const timeInBed = calcTimeInBed(answers.sleeptime, answers.getuptime, answers.hourstosleep);
    const actual = parseFloat(answers.hourstofallinsleep) || 0;
    return timeInBed > 0 && (actual / timeInBed) < 0.85;
  },
  recommendation: { ... }
}

// 引擎（3 行）
function processAssessment(answers: Record<string, string>): Tag[] {
  return tags
    .filter(tag => tag.match(answers))
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
}
```

### 可见问题计算（已足够简单，保持）

```typescript
function getVisibleQuestions(questions: Question[], answers: Record<string, string>): Question[] {
  return questions.filter(q => !q.depends || answers[q.depends.questionId] === q.depends.value);
}
```

---

## 六、页面层简化

### 现在

```
page.tsx (530 行)
  ├── useEffect × 3（数据加载 / 测试场景 / 可见问题）
  ├── renderLandingScreen()（内联，~120 行）
  ├── renderQuestionsScreen()（内联，~200 行）
  └── renderResultsScreen()（内联，~15 行）
```

### 简化后

```
page.tsx (~60 行)
  ├── useState: screen / answers / questionIndex
  └── 按 screen 渲染对应组件

LandingScreen.tsx (~80 行)   — 仅展示介绍 + 开始按钮
QuestionScreen.tsx (~150 行) — 单题卡片 + 进度 + 导航
ResultsScreen.tsx (~100 行)  — 标签列表 + 建议卡片（无调试信息）
```

---

## 七、数据加载简化

### 现在

```
page.tsx
  └── fetchAssessmentData()
        ├── fetch('/api/assessment/data')
        │     └── Strapi /sections + /questions + /assessment-tags
        └── 失败时 → 静态 TS 数据（兜底）
```

### 简化后

```
assessment-data.ts
  └── 直接 export questions / tags / sections（纯静态，无网络请求）

page.tsx
  └── import { questions, tags, sections } from '@/lib/assessment-data'
      // 无 useEffect，无加载状态，无网络请求
```

---

## 八、工作量估算

| 任务 | 估计工时 | 风险 |
|------|----------|------|
| 重写 `assessment.ts`（纯函数 + tags 内联 match） | 2h | 低 |
| 拆分 page.tsx → 3 个屏幕组件 | 2h | 低 |
| 重写 `ResultsScreen.tsx`（去调试信息） | 1h | 低 |
| 删除冗余 API 路由 + Strapi 数据同步逻辑 | 0.5h | 低 |
| 将测试工具移入 `tests/` 或 `__dev__/` | 0.5h | 低 |
| 回归测试（三个测试场景跑一遍） | 1h | 低 |
| **合计** | **~7h** | |

---

## 九、不在此次范围内的事项

- **国际化（i18n）**：问题文本已在 Strapi 中标记 `localized: true`，简化后可通过切换静态数据文件或保留 Strapi 问题文本 API 来支持，但不在本次简化范围内。
- **Strapi 问题/分区编辑**：如果业务需要通过 Strapi 后台动态编辑问题文案（而非改代码），则 `/api/assessment/data` 路由应保留，但其他冗余层仍可简化。
- **用户答案持久化**：当前 `saveResult` 写 localStorage 但未被消费，可在另一个 task 里决定是否对接用户账户系统。

---

## 十、建议优先级

本次简化收益明确、风险极低，建议作为 **P1 技术债清理**，在下一个功能迭代前完成。

核心交付物：
1. `web/src/lib/assessment.ts` — 替换 engine + calculations + data fetch 三个文件
2. `web/src/lib/assessment-data.ts` — 纯静态导出（重命名自 static-assessment-questions.ts）
3. `web/src/components/assessment/` — 三个屏幕组件
4. 删除 9 个冗余文件/路由
