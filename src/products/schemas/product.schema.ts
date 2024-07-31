import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Schema as MongooseSchema } from "mongoose";

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

// อธิบายการเชื่อมโยง:
//  product_category เป็นหมวดหมู่หลักสำหรับผลิตภัณฑ์ ซึ่งสามารถมีหมวดหมู่ย่อยได้
//  product เป็นข้อมูลผลิตภัณฑ์ที่เชื่อมโยงกับหมวดหมู่
//  product_item เป็นตัวแทนสินค้าของผลิตภัณฑ์แต่ละรายการ ซึ่งอาจแตกต่างกันในแง่ของ variation ต่างๆ เช่น สี, ขนาด
//  variation และ variation_option เป็นตัวแทนของ variation ที่เป็นไปได้สำหรับผลิตภัณฑ์ เช่น สี, ขนาด และค่าของ variation นั้นๆ
//  product_configuration เชื่อมโยง product_item กับ variation_option เพื่อระบุว่า product_item นั้นมี variation อะไรบ้าง
