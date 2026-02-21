# Assessment Data Review — 评估数据审查与数据库规划

本文档完成 **Assessment System Migration to Database** 第一步：梳理当前评估数据结构、依赖关系，并规划 Strapi 5 的 content types 与迁移策略。

---

## 1. 当前数据来源与依赖

| 文件 | 职责 | 被引用处 |
|------|------|----------|
| `web/src/data/static-assessment-questions.ts` | 题目定义 `staticQuestions`、标签定义 `staticTags`、分组 `assessmentSections`、工具函数 | assessment 页面、engine、API、flow-test |
| `web/src/data/static-assessment-calculations.ts` | 标签计算函数（如 `calcSleepEfficiency`, `isHealthy` 等）及常量 | `static-assessment-engine.ts` |
| `web/src/lib/static-assessment-engine.ts` | 用 answers + tags 计算命中标签、排序、校验、进度 | `/api/static-assessment`、assessment 页面 |

**数据流**：  
`staticQuestions` + `assessmentSections` → 前端展示与题目顺序 → 用户提交 `answers` → `staticAssessmentEngine.processAssessment(answers)` 使用 `staticTags` + `calculationFunctions` → 得到 `calculatedTags`（含 recommendation）→ 前端展示结果。

---

## 1.1 评估理念与 Tag → Booklet 对应关系

**理念**：一系列 **questions** → 用户 **answers** → 通过 **calculation** 得到对应的 **tags** → 每个 tag 对应一个 **解决方案 (booklet)**。

- **Booklet** 在代码中即 tag 的 `recommendation`：`title`（建议标题）、`content`（建议正文）、`tutorialLink`（对应教程文章，即解决方案入口）。
- 要求：**每个 tag 都必须有 booklet**（即 recommendation 含 title、content、tutorialLink），这样任意回答路径下计算出的 tag 都能对应到解决方案。

**验证**：

- 已实现 `web/src/lib/assessment-tag-booklet-verification.ts`：
  - `verifyEveryTagHasBooklet()`：检查全部 15 个 static tag 是否都有 recommendation + tutorialLink。
  - `runScenariosAndVerifyTagsHaveBooklets()`：用所有测试场景（moderate、severe、good 等）跑一遍 engine，确认每个场景下计算出的 tag 都带有 booklet。
- 请求 **GET /api/assessment-verify** 可得到完整报告：`allTagsHaveBooklet`、`tagBookletMap`（每个 tag 的 booklet 信息）、`scenarioCoverage`（各场景下命中的 tag 是否都有 booklet）、`summary`。

**Tag → Booklet 对应表**（当前 15 个 tag 均有 booklet）：

| Tag name | 标签文案 | 建议标题 (booklet) | tutorialLink (文章) |
|----------|----------|--------------------|----------------------|
| sleep_inefficiency | 睡眠效率低 | 合理提高睡眠效率 | /article/g5cdnwrbtd8y9lr84vnt1693 |
| irregular_schedule | 作息不规律 | 按时早起 | /article/u0wryasakus7fooak57kx1zl |
| poor_sleep_quality | 睡眠质量差 | 改善睡眠环境 | /article/c11i32ibrcteqrb0ce228zkx |
| unhealthy_lifestyle | 生活方式不健康 | 健康的生活方式 | /article/e9rwh72tv2duvzuj0v5p3zpw |
| idle_lifestyle | 生活单调 | 充实生活 | /article/v56rvd5dunn3ksi8jekukvyr |
| bedroom_overuse | 卧室过度使用 | 合理利用卧室 | /article/c11i32ibrcteqrb0ce228zkx |
| prenatal | 孕期特殊需求 | 孕期 | /article/u7c9ql8s5v6k6wpqg7in9x85 |
| postnatal | 产后特殊需求 | 产后 | /article/eejvu3vc2iu7fce35x3eo869 |
| student_issues | 学生特殊问题 | 改善大学生活 | /article/sa9yqxtu6s64e95b5ev2udgv |
| shift_work | 倒班工作问题 | 适应作息 | /article/lclrz6kaneqk59scj95dz4vc |
| maladaptive_behaviors | 适应不良行为 | 放弃为失眠努力 | /article/kqlrwhal1t4x650mmgjajiwk |
| excessive_complaining | 过度抱怨 | 终止抱怨 | /article/ianc38uy3d2tyiz3dpsqbvoo |
| medication_use | 药物使用 | 药物 | /article/i865rmsgjmelf8evdf8ucqzb |
| noise_problem | 噪音问题 | 尝试合理沟通 | /article/5d8821b0ae87d938157bb233 |
| partner_snoring | 伴侣打鼾 | 合理对待噪音 | /article/5d8821b0ae87d938157bb233 |

说明：同一篇文章可对应多个 tag（如 `c11i32ibrcteqrb0ce228zkx` 对应「睡眠质量差」与「卧室过度使用」；`5d8821b0ae87d938157bb233` 对应「噪音问题」与「伴侣打鼾」）。`5d8821b0ae87d938157bb233` 为 24 位 hex（旧版 ID），前端 `/article/[id]` 已支持按 documentId 或旧 ID 解析。

---

## 2. 题目数据结构 (StaticQuestion)

**定义位置**：`static-assessment-questions.ts` — `StaticQuestion` 接口与 `staticQuestions` 数组。

### 2.1 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | ✓ | 唯一标识，如 `status`, `sleepregular`, `hourstofallinsleep` |
| text | string | ✓ | 题干（当前仅中文） |
| type | enum | ✓ | `single_choice` \| `multiple_choice` \| `scale` \| `text` \| `number` \| `email` \| `date` \| `time` |
| category | enum | ✓ | `basic_info` \| `sleep_habits` \| `lifestyle` \| `work_study` \| `attitude` \| `environment` |
| required | boolean | ✓ | 是否必答 |
| options | array | 否 | 选项：`{ id?, value, text, score? }`，choice/scale 类题目使用 |
| depends | object | 否 | 条件显示：`{ questionId, value }`，满足才显示本题 |
| placeholder | string | 否 | 输入占位 |
| min, max, step, unit | number/string | 否 | 数字题范围与单位 |
| weight, hint | * | 否 | 遗留兼容，可不在 DB 中 |

### 2.2 题目数量与分类

- **题目总数**：31 题（见 `staticQuestions` 数组）。
- **分类**：6 个 category，对应 6 个 section（`assessmentSections`），每个 section 有 `id`、`name`、`description`、`order`、`questions`（题目 id 列表）。
- **条件题**：部分题目有 `depends`（如 `sleeptime`/`getuptime` 依赖 `sleepregular === 'yes'`），需在 schema 或 JSON 中保留。

### 2.3 与标签的依赖关系

- 标签的 `calc` 中通过 **question id** 引用题目（`question`、`input[]`）。
- 迁移后题目 id 需稳定（或保留唯一 UID），以便标签计算逻辑继续通过 id 取 answers。

---

## 3. 标签数据结构 (StaticTag)

**定义位置**：`static-assessment-questions.ts` — `StaticTag` 接口与 `staticTags` 数组。

### 3.1 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 唯一标识，如 `sleep_inefficiency`, `irregular_schedule` |
| text | string | 短标题（当前仅中文） |
| description | string | 描述 |
| category | enum | `sleep` \| `lifestyle` \| `work` \| `student` \| `special` \| `behavior` \| `environment` |
| priority | enum | `high` \| `medium` \| `low`，用于结果排序 |
| severity | enum | `mild` \| `moderate` \| `severe` |
| calc | object | 计算规则，见下表 |
| recommendation | object | `{ title, content, tutorialLink? }`，直接内嵌在 tag 中 |

**calc 结构**（决定标签是否命中）：

| calc 字段 | 含义 | 示例 |
|-----------|------|------|
| type | `simple` \| `function` \| `complex` | 当前仅用 simple / function |
| question | string | 题目 id（simple 时与 value 搭配） |
| value | string | 简单匹配值，如 `'no'` |
| func | string | 计算函数名，如 `calcSleepEfficiency`, `isHealthy` |
| input | string[] | 函数参数对应的题目 id 列表 |
| conditions | array | 未在现有 tag 中使用，可为后续扩展保留 |

### 3.2 标签数量与计算方式

- **标签总数**：15 个（见 `staticTags`）。
- **simple**：约 8 个，直接 `answers[question] === value`。
- **function**：约 7 个，调用 `static-assessment-calculations.ts` 中函数，如：
  - `calcSleepEfficiency(sleeptime, getuptime, hourstosleep, hourstofallinsleep)`
  - `isHealthy(sport, sunshine)`
  - `isIdle(pressure, lively)`
  - `isStimuli(bedroom, bed)`
  - `isAffected(irresponsible, inactive, excessive_rest, complain, ignore, medicine)`
  - `hasShiftWorkIssues(shiftwork, sleepregular)`
  - `hasStudentIssues(status, holiday, bedtimeearly)`

### 3.3 与题目、文章的关系

- **题目**：通过 `calc.question` / `calc.input` 引用题目 id。
- **文章**：`recommendation.tutorialLink` 为 `/article/{documentId}`，对应 Strapi articles；可保留为 URL 或改为 relation（article documentId）。

---

## 4. 分组与顺序 (AssessmentSection)

- **assessmentSections**：6 个 section，每个含 `id`、`name`、`description`、`order`、`questions`（题目 id 数组）。
- 前端用 `getAllSectionsOrdered()`、`getAllQuestionsOrdered()`、`getVisibleQuestions()` 决定展示顺序与条件显示。
- 迁移后 section 可与「题目分类」合并或单独建 content type，需能表达 order 与 question 列表。

---

## 5. 计算逻辑 (static-assessment-calculations.ts)

- **形式**：纯 TypeScript 函数，接受答案值，返回 `boolean` 或 `CalculationResult { value, confidence, reasoning }`。
- **依赖**：常量（如 `SLEEP_EFFICIENCY_THRESHOLD`）、`PointMap`、`YesNoMap` 等。
- **建议**：**首轮迁移将计算逻辑保留在代码中**，不在 Strapi 中存函数体；Strapi 只存：
  - 题目、选项、depends；
  - 标签的 name/text/description/category/priority/severity/recommendation；
  - 以及 **calc 的“配方”**（type、question、value、func、input、conditions），由现有 engine 按 func 名调用本地 calculation 函数。
- 若未来需要「无发版改规则」，再考虑将简单规则存为 JSON 或表达式，复杂逻辑仍用代码。

---

## 6. Strapi 5 数据库规划（建议）

### 6.1 Content Types 建议

| 内容类型 | 用途 | 主要字段（示意） |
|----------|------|------------------|
| **assessment-question** | 单道题目 | id(uid)、text、type、category、required、options(json 或 component)、depends(json)、min/max/step/unit、order |
| **assessment-section** | 分组与顺序 | id(uid)、name、description、order、questions(relation 多选 或 questionIds json) |
| **assessment-tag** | 标签与推荐 | name(uid)、text、description、category、priority、severity、calc(json)、recommendation(json 或 relation+title+content)、tutorialLink 或 relation to article |

- **多语言**：若需中英题目/标签文案，可为 text/description 等启用 Strapi i18n，或单独做 locale 字段；当前可先单语言（中文），与现有前端一致。
- **calc 存法**：以 JSON 字段存储完整 `calc` 对象，engine 读取后按 `type`/`func`/`input` 调用现有 calculation 函数，无需在 DB 中存函数体。

### 6.2 关系梳理

- **Section → Questions**：一对多（一个 section 包含多道题），可用 relation 或 questionIds 数组。
- **Tag → 题目**：仅通过 calc 中的 question id / input id 引用，无需在 Strapi 建 relation，保证 question uid 稳定即可。
- **Tag → 文章**：`recommendation.tutorialLink` 可改为 relation to **article**（用 documentId），前端生成链接；或继续存 URL 字符串。

### 6.3 迁移顺序建议

1. 在 Strapi 中创建 **assessment-question**、**assessment-section**、**assessment-tag**（及必要组件/枚举）。
2. 写迁移脚本：从 `static-assessment-questions.ts` 读出 `staticQuestions`、`assessmentSections`、`staticTags`，写入 Strapi（含 options、depends、calc、recommendation）。
3. 保持现有 **calculation 函数** 与 **engine 逻辑** 不变，改为：  
   - 题目列表从 API `GET /api/assessment-questions`（或 Strapi 代理）拉取；  
   - 标签列表从 API `GET /api/assessment-tags` 拉取；  
   - engine 仍用内存中的 calculation 函数 + tag.calc 计算命中。
4. 前端 assessment 页与 API `/api/static-assessment` 改为先拉取 questions/tags 再渲染与计算。
5. 校验：用现有 16 个测试场景跑一轮，对比静态数据与 API 数据结果一致后，再考虑下线静态 JSON 导入。

---

## 7. 依赖关系小结

```
static-assessment-questions.ts
├── staticQuestions[]        → 31 题，6 个 category，部分带 depends/options
├── staticTags[]             → 15 个 tag，含 calc + recommendation
├── assessmentSections[]      → 6 个 section，order + question ids
└── 工具函数                  → getQuestionsByCategory, getTagByName, shouldShowQuestion, getVisibleQuestions 等

static-assessment-calculations.ts
├── calculationFunctions    → 供 engine 按 tag.calc.func 调用
└── 常量/Map                  → PointMap, YesNoMap, 阈值等

static-assessment-engine.ts
├── 读 staticTags（将来改为 API）
├── 用 calculationFunctions + answers 计算命中
└── 返回 calculatedTags（含 recommendation）
```

---

## 8. 下一步（TODO 对应）

- [x] **Review Assessment Data** — 本文档完成数据结构与依赖梳理、Strapi schema 与迁移顺序规划。
- [ ] **Create Strapi Data Models** — 在 Strapi 5 后台创建 assessment-question、assessment-section、assessment-tag 及字段。
- [ ] **Migrate Data to Database** — 编写并执行迁移脚本，校验数据完整性。
- [ ] **Update Code for API Integration** — 前端与 engine 改为从 API 拉取 questions/tags，计算逻辑暂不变。

（若需要，可再拆一份「字段级」的 Strapi 字段清单与示例 JSON，便于直接在建 content type 时对照。）
