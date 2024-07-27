import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, HydratedDocument } from "mongoose";

@Schema()
export class ProductConfiguration extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "ProductItem",
  })
  productItemId: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "VariationOption",
  })
  variationOptionId: MongooseSchema.Types.ObjectId;
}

export type ProductConfigurationDocument =
  HydratedDocument<ProductConfiguration>;
export const ProductConfigurationSchema =
  SchemaFactory.createForClass(ProductConfiguration);
