import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

@Schema()
export class Variation extends Document {
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  value: string;
}

export type VariationDocument = HydratedDocument<Variation>;
export const VariationSchema = SchemaFactory.createForClass(Variation);
