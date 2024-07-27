import { Module } from "@nestjs/common";
import { ProductService } from "./products.service";
import { ProductController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";
import { ProductItem, ProductItemSchema } from "./schemas/product-item.schema";
import { ProductItemController } from "./product-item.controller";
import { ProductItemService } from "./product-item.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductItem.name, schema: ProductItemSchema },
    ]),
  ],
  controllers: [ProductController, ProductItemController],
  providers: [ProductService, ProductItemService],
  exports: [ProductService, ProductItemService],
})
export class ProductsModule {}
