import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./schemas/cart.schema";
import { CartItem, CartItemSchema } from "./schemas/cart-item.schema";
import {
  ProductItem,
  ProductItemSchema,
} from "src/products/schemas/product-item.schema";
import {
  Variation,
  VariationSchema,
} from "src/products/schemas/variations.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema,
      },

      { name: CartItem.name, schema: CartItemSchema },
      { name: ProductItem.name, schema: ProductItemSchema }, // ลงทะเบียน ProductItem schema
      { name: Variation.name, schema: VariationSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
