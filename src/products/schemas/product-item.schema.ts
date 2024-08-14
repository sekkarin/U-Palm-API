import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { Variation, VariationSchema } from "./variations.schema";

@Schema()
export class ProductItem extends Document {
  @Prop({ required: true, type: Number })
  qty_in_stock: number;

  @Prop({ type: String })
  product_image?: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  qty_discount: number;

  @Prop({ required: true, type: Number })
  shipping: number;

  @Prop({ required: true, type: Number })
  profit: number;

  @Prop({ required: true, type: Number })
  selling_price: number;

  @Prop({ type: [VariationSchema], default: [] })
  variations?: Variation[];
}

export type ProductItemDocument = HydratedDocument<ProductItem>;
export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
ProductItemSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["_id"];
    delete ret["updatedAt"];
    delete ret["__v"];
    ret["product_item_id"] = doc._id;
    return ret;
  },
});
