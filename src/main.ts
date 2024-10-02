import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as passport from "passport";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { corsOptions } from "./utils/corsOptions";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ ...corsOptions });
  app.use(cookieParser());

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(passport.initialize());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.setGlobalPrefix("api");
  if (process.env.NODE_ENV == "dev") {
    const config = new DocumentBuilder()
      .setTitle("U Palm api Documentation")
      .setDescription("The U palm API description")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("", app, document);
  }
  await app.listen(3000);
}
bootstrap();
