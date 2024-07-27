import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, HydratedDocument } from "mongoose";

@Schema()
export class Variation extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "ProductCategory",
  })
  categoryId: MongooseSchema.Types.ObjectId;
}

export type VariationDocument = HydratedDocument<Variation>;
export const VariationSchema = SchemaFactory.createForClass(Variation);
