import { Module } from "@nestjs/common";
import { ProductConfigurationService } from "./product-configuration.service";
import { ProductConfigurationController } from "./product-configuration.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ProductConfiguration,
  ProductConfigurationSchema,
} from "./schemas/product-configuration.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductConfiguration.name, schema: ProductConfigurationSchema },
    ]),
  ],
  controllers: [ProductConfigurationController],
  providers: [ProductConfigurationService],
  exports: [ProductConfigurationService],
})
export class ProductConfigurationModule {}
