import { Prop, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Address } from "./user-address.schema";

export type AddressContractDocument = HydratedDocument<AddressContract>;

@Schema({
  timestamps: true,
})
export class AddressContract extends Address {
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 2,
  })
  entrepreneurName: string;

  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 2,
  })
  numberTaxpayer: string;
}
