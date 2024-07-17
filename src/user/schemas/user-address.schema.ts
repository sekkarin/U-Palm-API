import { Prop, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AddressDocument = HydratedDocument<Address>;

@Schema({
  timestamps: true,
})
export class Address {
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
  })
  firstName: string;

  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
  })
  lastName: string;

  // รายละเอียดที่อยู่
  @Prop({
    type: String,
  })
  addressDetail: string;

  // ตำบล
  @Prop({
    type: String,
  })
  subDistrict: string;

  // อำเภอ
  @Prop({
    type: String,
  })
  district: string;

  // จังหวัด
  @Prop({
    type: String,
  })
  province: string;
  // รหัสไปรษณีย์
  @Prop({
    type: String,
  })
  postcode: string;
  // เบอร์ติดต่อ
  @Prop({
    type: String,
  })
  phone: string;
  // email
  @Prop({
    type: String,
  })
  email: string;
  // email
  @Prop({
    type: Boolean,
    default: false,
  })
  isDefault: boolean;
}
