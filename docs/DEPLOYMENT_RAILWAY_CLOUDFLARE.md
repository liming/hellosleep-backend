# 部署指南：Railway + Vercel / Cloudflare

## 费用：$5/月 (Railway) + 免费 (Vercel Hobby) 或 免费 (Cloudflare Pages)

---

## 第一步：Railway 部署后端

### 1.1 创建 Railway 账号
1. 访问 https://railway.app
2. 用 GitHub 登录

### 1.2 创建项目
1. New Project → Deploy from GitHub repo
2. 选择 `hellosleep-app` 仓库
3. 选择 `service` 文件夹作为根目录

### 1.3 添加 PostgreSQL
1. Railway Dashboard → 你的项目
2. + New → Database → PostgreSQL
3. 记下 `DATABASE_URL`（会自动生成）

### 1.4 配置环境变量
在 Railway 项目的 Variables 里添加：

```
DATABASE_CLIENT=postgres
DATABASE_URL=<从上面获取>
NODE_ENV=production
ENV_PATH=production

# Strapi 管理面板
ADMIN_JWT_SECRET=<生成一个随机字符串>
JWT_SECRET=<生成一个随机字符串>
APP_KEYS=<生成随机字符串>
API_TOKEN_SALT=<生成随机字符串>

# 你的域名（后面配置）
URL=https://your-domain.com
```

### 1.5 部署
- Railway 会优先使用 `service/Dockerfile`（解决 sharp/libvips 兼容问题）
- 若无 Dockerfile 则回退到 Nixpacks 检测 Node.js
- 部署完成后，记下 `https://your-project.railway.app`

---

## 第二步：Vercel 部署前端（推荐）

### 2.1 创建 Vercel 账号
1. 访问 https://vercel.com
2. 用 GitHub 登录

### 2.2 创建项目
1. Add New → Project
2. 选择 `hellosleep-app` 仓库
3. 配置：
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `web`（点击 Edit 选择）
   - **Build Command**: 默认 `npm run build`
   - **Output Directory**: 默认（Next.js 自动处理）

### 2.3 添加环境变量
Settings → Environment Variables 添加：

```
NEXT_PUBLIC_STRAPI_URL=https://your-railway-app.railway.app
NEXT_PUBLIC_STRAPI_API_TOKEN=<可选：Strapi API token>
```

### 2.4 部署
- 点击 Deploy
- 完成后记下 `https://your-project.vercel.app`

### 2.5 自定义域名
- Project Settings → Domains → Add
- 输入你的域名并按提示配置 DNS

---

## 第二步（备选）：Cloudflare Pages 部署前端

### 2.1 创建 Cloudflare 账号
1. 访问 https://pages.cloudflare.com
2. 用 GitHub 登录

### 2.2 创建项目
1. Create a project → Connect to Git
2. 选择 `hellosleep-app` 仓库
3. 配置：
   - **Production branch**: `main`
   - **Build command**: `cd web && npm run build`
   - **Build output directory**: `web/.next`
   - **Root directory**: `/`（在更高级设置里）

### 2.3 添加环境变量
```
NEXT_PUBLIC_STRAPI_URL=https://your-project.railway.app
NEXT_PUBLIC_STRAPI_API_TOKEN=<可选：Strapi API token>
```

### 2.4 部署
- 完成后记下 `https://your-domain.pages.dev`

---

## 第三步：绑定域名

### 3.1 在 Cloudflare 添加域名
1. Cloudflare Dashboard → 添加你的域名
2. 修改 DNS 指向 Cloudflare

### 3.2 配置自定义域名
1. Cloudflare Pages → 你的项目 → Custom domains
2. 添加你的域名（如 `hellosleep.com`）
3. 按提示配置 DNS 记录

---

## 第四步：Strapi 配置

### 4.1 设置生产环境变量
在 Railway 环境变量里添加：

```
STRAPI_URL=https://your-railway-app.railway.app
NEXT_PUBLIC_API_URL=https://your-vercel-app.vercel.app
```

### 4.2 创建管理员账号
1. 访问 `https://your-project.railway.app/admin`
2. 第一次访问时创建管理员账号

### 4.3 配置内容权限
- Settings → Users & Permissions Plugin → Roles → Public
- 勾选需要的 API 权限

---

## 常用命令

### 本地测试 Railway 部署
```bash
# 连接到 Railway 数据库
railway link
railway run npm run develop

# 查看日志
railway logs
```

### 重新部署
- Railway: Push 到 GitHub 自动触发
- Cloudflare: Push 到 GitHub 自动触发

---

## 费用明细

| 服务 | 免费额度 | 费用 |
|------|----------|------|
| Railway (1GB RAM) | $5 credit/月 | $5/月 |
| Cloudflare Pages | 无限 | 免费 |
| 域名 | ~$10/年 | ~$10/年 |
| **合计** | | **~$70/年** |
