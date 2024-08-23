import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { Variation, VariationSchema } from "./variations.schema";

@Schema()
export class ProductItem extends Document {
  @Prop({ required: true, type: Number })
  qty_in_stock: number;

  // @Prop({ type: String, required: true })
  // product_image_item?: string;

  @Prop({ required: true, type: Number })
  base_price: number;

  @Prop({ required: true, type: Number })
  qty_discount: number;

  @Prop({ required: true, type: Number })
  discount: number;

  @Prop({ required: true, type: Number })
  shipping: number;

  @Prop({ required: true, type: Number })
  profit: number;

  @Prop({ type: [VariationSchema], default: [] })
  variations?: Variation[];
}

export type ProductItemDocument = HydratedDocument<ProductItem>;
export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
ProductItemSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret["_id"];
    delete ret["id"];
    delete ret["updatedAt"];
    delete ret["__v"];
    ret["product_item_id"] = doc._id;
    return ret;
  },
});
ProductItemSchema.virtual("selling_price").get(function () {
  return this.base_price + this.shipping + this.profit;
});
