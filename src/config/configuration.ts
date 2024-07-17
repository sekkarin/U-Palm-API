export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_URL || "mongodb://localhost:27017/UPalm",
  },
  googleAuth: {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  auth: {
    sessionSecret: process.env.SESSION_SECRET || "SESSION_SECRET",
  },
});
