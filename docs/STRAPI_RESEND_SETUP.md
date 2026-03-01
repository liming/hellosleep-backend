# Strapi 忘记密码邮件配置（Resend）

本文档用于配置 `service`（Strapi）通过 Resend 发送“忘记密码”邮件，按顺序执行即可。

## 1. 在 Resend 准备 SMTP 凭证

1. 注册并登录 Resend。
2. 验证发件域名（推荐）。
3. 在 Resend 后台创建 SMTP 凭证，记录：
   - SMTP Host（通常是 `smtp.resend.com`）
   - SMTP Username
   - SMTP Password

## 2. 在 Railway 添加环境变量（Strapi 服务）

进入 Railway 的 Strapi 服务（`service`）Variables，添加：

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=resend
SMTP_PASSWORD=YOUR_RESEND_SMTP_PASSWORD
SMTP_FROM=HelloSleep <noreply@your-domain.com>
SMTP_REPLY_TO=support@your-domain.com
```

说明：
- 使用端口 `465` 时，`SMTP_SECURE=true`
- 如果使用 `587`，请改为：
  - `SMTP_PORT=587`
  - `SMTP_SECURE=false`

## 3. 安装 Strapi 邮件 Provider

在仓库根目录执行：

```bash
cd service
npm i @strapi/provider-email-nodemailer
```

## 4. 更新 `service/config/plugins.js`

在现有配置上加入 `email` 配置（保留你已有的 `upload` 和 `users-permissions`）：

```js
module.exports = ({ env }) => ({
  upload: false,
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.resend.com'),
        port: env.int('SMTP_PORT', 465),
        secure: env.bool('SMTP_SECURE', true),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_FROM'),
        defaultReplyTo: env('SMTP_REPLY_TO'),
      },
    },
  },
});
```

## 5. 配置 Strapi 重置密码回调地址

Strapi Admin 后台：

`Settings` → `Users & Permissions Plugin` → `Advanced Settings`

设置 Reset Password URL（示例）：

```text
https://your-frontend-domain.com/?code=<%= CODE %>
```

> 当前前端已支持从 URL 自动读取 `code`，可直接使用上述格式。

## 6. 部署并验证

1. 重新部署 Railway 的 Strapi 服务。
2. 在前端点击“忘记密码”，输入注册邮箱。
3. 检查邮箱（包括垃圾邮件）。
4. 打开邮件链接后，应带有 `?code=...`。
5. 在前端输入新密码并提交，验证是否成功重置并登录。

## 7. 常见问题排查

- 报错 `can not connect to any SMTP server`：
  - 检查 `SMTP_HOST/PORT/SECURE` 是否匹配。
  - 检查 `SMTP_USERNAME/PASSWORD` 是否有效。
- 能调用忘记密码接口但收不到邮件：
  - 检查发件域名是否验证完成。
  - 检查 `SMTP_FROM` 是否使用了已验证域名。
  - 检查垃圾邮件箱。
