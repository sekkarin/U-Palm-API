import { NestFactory } from "@nestjs/core";
import * as session from "express-session";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import * as passport from "passport";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.use(
    session({
      secret: configService.getOrThrow<string>("auth.sessionSecret"),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 36000000 },
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
