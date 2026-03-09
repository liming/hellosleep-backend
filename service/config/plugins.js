module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        baseUrl: env('R2_PUBLIC_URL'),
        s3Options: {
          credentials: {
            accessKeyId: env('R2_ACCESS_KEY_ID'),
            secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
          },
          region: env('R2_REGION', 'auto'),
          endpoint: env('R2_ENDPOINT'),
          forcePathStyle: true,
          params: {
            Bucket: env('R2_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },

  email: {
    config: {
      provider: 'strapi-provider-email-resend',
      providerOptions: {
        apiKey: env('RESEND_API_KEY'),
      },
      settings: {
        defaultFrom: env('SMTP_FROM'),
        defaultReplyTo: env('SMTP_REPLY_TO'),
      },
    },
  },
});
