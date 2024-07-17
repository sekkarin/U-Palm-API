import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategy/google.strategy";
import { SessionSerializer } from "src/utils/SessionSerializer";
import { LocalStrategy } from "./strategy/local.strategy";
import { LoggerMiddleware } from "src/utils/middlewares/LoggerMiddleware";

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, SessionSerializer, LocalStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
