import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  Document,
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from "mongoose";
import { ProductItem } from "./product-item.schema";

@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop({
    required: true,
    type: String,
    trim: true,
    max: 100,
  })
  name: string;

  @Prop({
    type: String,
    trim: true,
  })
  description?: string;

  @Prop({
    type: [String],
    required: true,
  })
  product_image: string[];
  @Prop({
    type: String,
    required: true,
  })
  image_banner_adverting: string;

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
    type: [{ type: Types.ObjectId, ref: ProductItem.name }], // อ้างอิงไปยัง ProductItem
    default: [],
  })
  items?: Types.ObjectId[];
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
