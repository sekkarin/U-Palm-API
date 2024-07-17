import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Roles } from "src/enums/roles";
import { Address } from "./user-address.schema";
import { AddressContract } from "./user-contract.schea";

export type UserDocument = HydratedDocument<User>;

export type BodyDocs = {
  name: string;
  documentation: [Record<string, any>];
};

@Schema({
  timestamps: true,
})
export class User {
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

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop({
    type: String,
    max: 50,
    min: 5,
    select: false,
  })
  password?: string;
  @Prop({
    type: String,
  })
  photo?: string;

  @Prop({
    default: Roles.USER,
  })
  roles: Roles[];

  addresses?: Address[];
  contracts?: AddressContract[];

  typeUsers?: BodyDocs[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["password"];
    delete ret["_id"];
    ret["userId"] = doc._id;
    return ret;
  },
});
