import { Module } from "@nestjs/common";
import { ProductCategoryService } from "./product-category.service";
import { ProductCategoryController } from "./product-category.controller";
import {
  ProductCategory,
  ProductCategorySchema,
} from "./schemas/product-category.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
})
export class ProductCategoryModule {}
