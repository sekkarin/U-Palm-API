import { NestFactory } from "@nestjs/core";
import * as session from "express-session";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import * as passport from "passport";
import { ValidationPipe } from "@nestjs/common";
import RedisStore from "connect-redis";
import { createClient } from "redis";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  // Initialize store.
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
  });
  // const RedisStore = createRedisStore(session);
  // const redisClient = createClient({
  //   host: configService.getOrThrow<string>("redis.host"),
  //   port: configService.getOrThrow<number>("redis.port"),
  // });
  app.enableCors();
  app.use(
    session({
      secret: configService.getOrThrow<string>("auth.sessionSecret"),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 36000000 },
      store: redisStore,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
