export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_URL || "mongodb://localhost:27017/UPalm",
    username: process.env.DATABASE_USERNAME || "mongoAdmin",
    password: process.env.DATABASE_PASSWORD || "125478963m",
    databaseName: process.env.DATABASE_NAME || "U-Palm",
  },
  googleAuth: {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callBackURL: process.env.GOOGLE_CALL_BACK_URL,
  },
  auth: {
    sessionSecret: process.env.SESSION_SECRET || "SESSION_SECRET",
  },
  s3: {
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_BUCKET_REGION: process.env.AWS_S3_BUCKET_REGION,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  },
  client: {
    baseUrl: process.env.CLIENT_DOMAIN,
  },
  jwt: {
    accessToken: process.env.JWT_ACCESS_TOKEN,
    refreshToken: process.env.JWT_REFRESH_TOKEN,
    expiresAccessToken: process.env.EXPIRES_IN_ACCESS_TOKEN,
    expiresRefreshToken: process.env.EXPIRES_IN_REFRESH_TOKEN,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password_hashed: process.env.PASSWORD_HASHED,
  },
});
