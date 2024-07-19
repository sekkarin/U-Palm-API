import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({
  timestamps: true,
})
export class Supplier {
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
  })
  name: string;

  @Prop({
    type: String,
    max: 256,
  })
  description?: string;

  imageBanners: [
    {
      type: string;
    },
  ];

  profileImage: {
    type: string;
    required: true;
  };
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
