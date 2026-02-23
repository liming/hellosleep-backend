module.exports = ({ env }) => ({
  // Disable upload plugin to avoid sharp native module issues (darwin-arm64, linux-x64).
  // Re-enable when sharp is fixed. Use external provider (e.g. Cloudinary) if uploads are needed.
  upload: false,
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
});
