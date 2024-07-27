import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";

@Schema()
export class VariationOption extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "Variation",
  })
  variation_id: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  value: string;
}

export const VariationOptionSchema =
  SchemaFactory.createForClass(VariationOption);
