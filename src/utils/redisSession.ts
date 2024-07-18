import RedisStore from "connect-redis";
import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect().catch(console.error);
// Initialize store.
export const redisStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
});
