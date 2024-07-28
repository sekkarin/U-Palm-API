import { Module } from "@nestjs/common";
import { ProductService } from "./products.service";
import { ProductController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";
import { ProductItem, ProductItemSchema } from "./schemas/product-item.schema";
import { ProductItemController } from "./product-item.controller";
import { ProductItemService } from "./product-item.service";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductItem.name, schema: ProductItemSchema },
    ]),
  ],
  controllers: [ProductController, ProductItemController],
  providers: [ProductService, ProductItemService, ManageFileS3Service],
  exports: [ProductService, ProductItemService],
})
export class ProductsModule {}
