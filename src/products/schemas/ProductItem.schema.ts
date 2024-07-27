import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema()
export class ProductItem extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "Product",
  })
  product_id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  SKU: string;

  @Prop({
    required: true,
    type: Number,
  })
  qty_in_stock: number;

  @Prop({
    type: String,
  })
  product_image?: string;

  @Prop({
    required: true,
    type: Number,
  })
  price: number;
}

export type ProductItemDocument = HydratedDocument<ProductItem>;
export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
