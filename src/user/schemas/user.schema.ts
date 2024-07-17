import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

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
  })
  password?: string;
  // address
  // contract
  // docs delivered
  // typeUser
  // - form
}

export const UserSchema = SchemaFactory.createForClass(User);
