import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { ProductItem, ProductItemSchema } from "./product-item.schema";

@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop({
    required: true,
    type: String,
    max: 50,
  })
  name: string;

  @Prop({
    type: String,
  })
  description?: string;

  @Prop({
    type: String,
  })
  product_image?: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "ProductCategory",
  })
  category_id: MongooseSchema.Types.ObjectId;
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "Supplier",
  })
  supplier_id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [ProductItemSchema],
    default: [],
  })
  items?: ProductItem[];
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["_id"];
    delete ret["updatedAt"];
    delete ret["__v"];
    ret["product_id"] = doc._id;
    return ret;
  },
});