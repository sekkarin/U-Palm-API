import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategy/google.strategy";
import { SessionSerializer } from "src/utils/SessionSerializer";
import { LocalRegisterStrategy } from "./strategy/local-register.strategy";
import { LoggerMiddleware } from "src/utils/middlewares/LoggerMiddleware";
import { UserService } from "src/user/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { LocalLoginStrategy } from "./strategy/local-login.strategy";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    SessionSerializer,
    LocalRegisterStrategy,
    LocalLoginStrategy,
    UserService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
