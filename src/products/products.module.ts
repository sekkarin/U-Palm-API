import { Module } from "@nestjs/common";
import { ProductService } from "./products.service";
import { ProductController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";
import { ProductItem, ProductItemSchema } from "./schemas/product-item.schema";
import { Variation, VariationSchema } from "./schemas/variations.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductItem.name, schema: ProductItemSchema },
      { name: Variation.name, schema: VariationSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ManageFileS3Service],
  exports: [ProductService],
})
export class ProductsModule {}
