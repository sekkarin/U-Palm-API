import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

@Schema()
export class Variation extends Document {
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  value: string;
  @Prop({
    type: Date,
    default: null,
  })
  isDeleted: Date;
}

export type VariationDocument = HydratedDocument<Variation>;
export const VariationSchema = SchemaFactory.createForClass(Variation);
VariationSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["_id"];
    delete ret["id"];
    delete ret["updatedAt"];
    delete ret["__v"];
    ret["variation_id"] = doc._id;
    return ret;
  },
});
