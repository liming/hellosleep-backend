module.exports = ({ env }) => ({
  // Disable upload plugin to avoid sharp native module issues (darwin-arm64, linux-x64).
  // Re-enable when sharp is fixed. Use external provider (e.g. Cloudinary) if uploads are needed.
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
