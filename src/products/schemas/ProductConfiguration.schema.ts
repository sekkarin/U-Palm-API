import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema()
export class ProductConfiguration extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "ProductItem",
  })
  product_item_id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "VariationOption",
  })
  variation_option_id: MongooseSchema.Types.ObjectId;
}

export type ProductConfigurationDocument =
  HydratedDocument<ProductConfiguration>;
export const ProductConfigurationSchema =
  SchemaFactory.createForClass(ProductConfiguration);
