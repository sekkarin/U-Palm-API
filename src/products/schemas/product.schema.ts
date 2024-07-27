import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema({
  timestamps: true,
})
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
  productImage?: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "ProductCategory",
  })
  categoryId: MongooseSchema.Types.ObjectId;
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "Supplier",
  })
  supplierId: MongooseSchema.Types.ObjectId;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
