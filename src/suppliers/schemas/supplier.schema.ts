import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema()
class Contact {
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
    trim: true,
  })
  con_person: string;

  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
    trim: true,
  })
  telephone: string;

  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
    trim: true,
  })
  address: string;

  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
    trim: true,
  })
  con_remark: string;
}

@Schema({
  timestamps: true,
})
export class Supplier {
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
    trim: true,
  })
  email: string;
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
  })
  country: string;
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
  })
  city: string;
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
  })
  state: string;
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
  })
  zip: string;
  @Prop({
    required: true,
    type: String,
    max: 50,
    min: 3,
  })
  address: string;

  @Prop({
    required: true,
    type: String,
  })
  profileImage?: string;

  @Prop({
    required: true,
    type: Object,
  })
  contacts_person_1: Contact;
  @Prop({
    type: Object,
  })
  contacts_person_2: Contact;
  @Prop({
    type: Date,
    default: null,
  })
  isDeleted: Date;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
SupplierSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["_id"];
    delete ret["isDeleted"];
    delete ret["updatedAt"];
    delete ret["__v"];
    ret["supplier_id"] = doc._id;
    return ret;
  },
});
