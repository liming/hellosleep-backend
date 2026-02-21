# Backlog 使用指南

## 任务结构

每个任务包含：
- `id`: 唯一标识
- `title`: 任务标题
- `description`: 详细描述
- `priority`: 优先级 (high/medium/low)
- `status`: 状态 (backlog/in_progress/done)
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

## 状态流转

```
backlog → in_progress → done
```

## 添加任务

直接编辑 `tasks.json`，在 `backlog` 列表中添加新任务。

## Cronjob 会检查

- `status` 为 `backlog` 的任务
- 按 `priority` 排序 (high → medium → low)
- 找到新任务后调用 Claude Code 开发
