import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, HydratedDocument } from "mongoose";

@Schema()
export class ProductItem extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Product" })
  product_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: String })
  SKU: string;

  @Prop({ required: true, type: Number })
  qty_in_stock: number;

  @Prop({ type: String })
  product_image?: string;

  @Prop({ required: true, type: Number })
  price: number;
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
