import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, HydratedDocument } from "mongoose";

@Schema()
export class ProductCategory extends Document {
  @Prop({ required: true, type: String })
  category_name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "ProductCategory" })
  parent_category_id?: MongooseSchema.Types.ObjectId;
}

export type ProductCategoryDocument = HydratedDocument<ProductCategory>;
export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
ProductCategorySchema.set("toJSON", {
  transform(doc, ret) {
    delete ret["_id"];
    delete ret["__v"];
    ret["categoryId"] = doc._id;
    return ret;
  },
});
