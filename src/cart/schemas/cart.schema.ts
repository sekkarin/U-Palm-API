import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { User } from "src/user/schemas/user.schema";
import { CartItem, CartItemSchema } from "./cart-item.schema";

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  user_id: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["_id"];
    delete ret["updatedAt"];
    delete ret["__v"];
    ret["cart_id"] = doc._id.toString();
    return ret;
  },
});
