import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, HydratedDocument } from "mongoose";

@Schema()
export class VariationOption extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "Variation",
  })
  variationId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: String })
  value: string;
}

export type VariationOptionDocument = HydratedDocument<VariationOption>;
export const VariationOptionSchema =
  SchemaFactory.createForClass(VariationOption);
