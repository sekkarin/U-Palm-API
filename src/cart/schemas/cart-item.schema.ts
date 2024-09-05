import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { ProductItem } from "src/products/schemas/product-item.schema";
import { Variation } from "src/products/schemas/variations.schema";

@Schema()
export class CartItem {
  @Prop({
    type: Types.ObjectId,
    ref: ProductItem.name,
    required: true,
  })
  product_item_id: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
    min: 1,
  })
  qty: number;

  @Prop({ type: Types.ObjectId, ref: Variation.name, required: true })
  variation_id: Types.ObjectId;
}
export type CartItemDocument = HydratedDocument<CartItem>;
export const CartItemSchema = SchemaFactory.createForClass(CartItem);
CartItemSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["_id"];
    delete ret["id"];
    delete ret["updatedAt"];
    delete ret["__v"];
    ret["cart_item_id"] = doc._id;
    return ret;
  },
});
