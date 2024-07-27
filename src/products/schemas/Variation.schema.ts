import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema()
export class Variation extends Document {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "Category",
  })
  category_id: MongooseSchema.Types.ObjectId;
}

export type VariationDocument = HydratedDocument<Variation>;
export const VariationSchema = SchemaFactory.createForClass(Variation);
