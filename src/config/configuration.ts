export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_URL || "mongodb://localhost:27017/UPalm",
    username: process.env.DATABASE_USERNAME || "mongoAdmin",
    password: process.env.DATABASE_PASSWORD || "125478963m",
    databaseName: process.env.DATABASE_NAME || "U-Palm",
  },
  googleAuth: {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  auth: {
    sessionSecret: process.env.SESSION_SECRET || "SESSION_SECRET",
  },
});
