import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema()
export class Product extends Document {
  @Prop({
    required: true,
    type: String,
    max: 50,
  })
  name: string;

  @Prop({
    type: String,
  })
  description?: string;

  @Prop({
    type: String,
  })
  product_image?: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "Category",
  })
  category_id: MongooseSchema.Types.ObjectId;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
