import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { PassportModule } from "@nestjs/passport";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import configuration from "./configs/configuration";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { ProductsModule } from "./products/products.module";
import { ProductController } from "./products/products.controller";
import { ProductCategoryModule } from "./product-category/product-category.module";
import { ManageFileS3Service } from "./utils/services/up-load-file-s3.service";
import { CartModule } from "./cart/cart.module";
import { User, UserSchema } from "./user/schemas/user.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("database.host"),
        auth: {
          username: configService.get<string>("database.username"),
          password: configService.get<string>("database.password"),
        },

        dbName: configService.get<string>("database.databaseName"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    PassportModule.register({
      session: false,
    }),
    SuppliersModule,
    ProductsModule,
    ProductCategoryModule,
    CartModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>("email.emailAddress"),
            pass: configService.get<string>("email.emailAuth"),
          },
        },
        defaults: {
          from: `"U-Palm-no-reply ${configService.get<string>("email.emailAddress")}"`,
        },
        template: {
          dir: __dirname + "/templates",
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, ManageFileS3Service],
})
export class AppModule {}
