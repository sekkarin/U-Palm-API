import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";
import { Product, ProductDocument } from "./schemas/product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";
import {
  ProductItem,
  ProductItemDocument,
} from "./schemas/product-item.schema";
import { Variation, VariationDocument } from "./schemas/variations.schema";
import { Cart, CartDocument } from "src/cart/schemas/cart.schema";
import { ProductPaginationQueryParamsDto } from "./dto/product-pagination";
import { PaginatedDto } from "src/utils/dto/paginated.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly uploadFileS3Service: ManageFileS3Service,
    @InjectModel(ProductItem.name)
    private productItemModel: Model<ProductItemDocument>,
    @InjectModel(Variation.name)
    private variationModel: Model<VariationDocument>,
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // สร้าง Product ใหม่
    const createdProduct = new this.productModel({
      name: createProductDto.name,
      description: createProductDto.description,
      product_image: createProductDto.product_image,
      image_banner_adverting: createProductDto.image_banner_adverting,
      category_id: createProductDto.category_id,
      supplier_id: createProductDto.supplier_id,
    });

    // ตรวจสอบว่า ProductItem มีการส่งเข้ามาใน DTO หรือไม่
    if (createProductDto.items && createProductDto.items.length > 0) {
      const productItemIds = [];

      // ลูปผ่าน ProductItem ใน DTO
      for (const item of createProductDto.items) {
        const productItem = new this.productItemModel({
          qty_in_stock: item.qty_in_stock,
          base_price: item.base_price,
          qty_discount: item.qty_discount,
          discount: item.discount,
          shipping: item.shipping,
          profit: item.profit,
        });

        // ตรวจสอบว่า Variation มีการส่งเข้ามาใน DTO หรือไม่
        if (item.variations && item.variations.length > 0) {
          const variationIds = [];

          // ลูปผ่าน Variation ใน DTO
          for (const variationDto of item.variations) {
            const variation = new this.variationModel({
              name: variationDto.name,
              value: variationDto.value,
            });

            const savedVariation = await variation.save();
            variationIds.push(savedVariation._id); // เก็บ _id ของ Variation ที่สร้างแล้ว
          }

          productItem.variations = variationIds; // เพิ่มการเชื่อมโยง Variation IDs ไปยัง ProductItem
        }

        const savedProductItem = await productItem.save(); // บันทึก ProductItem ที่สร้างแล้ว
        productItemIds.push(savedProductItem._id); // เก็บ _id ของ ProductItem ที่สร้างแล้ว
      }

      createdProduct.items = productItemIds; // เพิ่มการเชื่อมโยง ProductItem IDs ไปยัง Product
    }

    try {
      // บันทึก Product ที่สร้างพร้อมข้อมูลที่อ้างอิงแล้ว
      return await createdProduct.save();
    } catch (error) {
      // ถ้าเกิดข้อผิดพลาดในการบันทึก ให้ลบข้อมูลที่อัปโหลดแล้ว
      this.handleCreateProductError(error, createProductDto, createdProduct);
      throw new BadRequestException("Failed to create product");
    }
  }
  private async handleCreateProductError(
    error: any,
    createProductDto: CreateProductDto,
    createdProduct: Document<unknown, ProductDocument>,
  ) {
    console.error("Error creating product:", error);
    console.log("Product", createdProduct);
  }

  async findAll({
    limit = 10,
    page = 1,
    query = "",
  }: ProductPaginationQueryParamsDto) {
    const itemCount = await this.productModel.countDocuments({
      isDeleted: null,
    });
    const productDocument = await this.productModel
      .find({
        isDeleted: null,
        $or: [
          {
            name: {
              $regex: query,
              $options: "i",
            },
          },
          {
            description: { $regex: query, $options: "i" },
          },
        ],
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "items", // ต้องตรงกับ field ที่ถูกอ้างอิง
        model: "ProductItem",
        populate: {
          path: "variations", // ต้องตรงกับ field ที่ถูกอ้างอิง
          model: "Variation",
        },
      })
      .populate("category_id supplier_id")
      .exec();
    return new PaginatedDto<Product>(productDocument, page, limit, itemCount);
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel
      .findById(id)
      .populate({
        path: "items", // ต้องตรงกับ field ที่ถูกอ้างอิง
        model: "ProductItem",
        populate: {
          path: "variations", // ต้องตรงกับ field ที่ถูกอ้างอิง
          model: "Variation",
        },
      })
      .populate("category_id supplier_id")
      .exec();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    // files: {
    //   product_image?: Express.Multer.File[];
    // },
  ) {
    // ค้นหา Product ก่อนที่จะทำการอัปเดต
    const product = await this.productModel
      .findById(id)
      .populate<{
        items: (ProductItemDocument & { variations: VariationDocument })[];
      }>({
        path: "items", // ต้องตรงกับ field ที่ถูกอ้างอิง
        model: "ProductItem",
        populate: {
          path: "variations", // ต้องตรงกับ field ที่ถูกอ้างอิง
          model: "Variation",
        },
      })
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    // console.log(updateProductDto);
    // จัดการไฟล์รูปภาพใหม่ ถ้ามีการอัปโหลดเข้ามา
    // if (files.product_image && files.product_image.length > 0) {
    //   // ลบรูปภาพเก่าที่อยู่บน S3
    //   if (product.product_image) {
    //     await this.uploadFileS3Service.deleteImage(product.product_image);
    //   }

    //   // อัปโหลดรูปภาพใหม่
    //   productImage = await this.uploadFileS3Service.uploadFile(
    //     files.product_image[0],
    //   );
    // }

    // ตรวจสอบและอัปเดต ProductItems และ Variations
    if (updateProductDto.items && updateProductDto.items.length > 0) {
      const productItemIds = [];

      // ลูปผ่าน ProductItem ใน DTO
      for (const item of updateProductDto.items) {
        const productItem = new this.productItemModel({
          qty_in_stock: item.qty_in_stock,
          base_price: item.base_price,
          qty_discount: item.qty_discount,
          discount: item.discount,
          shipping: item.shipping,
          profit: item.profit,
        });

        // ตรวจสอบว่า Variation มีการส่งเข้ามาใน DTO หรือไม่
        if (item.variations && item.variations.length > 0) {
          const variationIds = [];

          // ลูปผ่าน Variation ใน DTO
          for (const variationDto of item.variations) {
            const variation = new this.variationModel({
              name: variationDto.name,
              value: variationDto.value,
            });

            const savedVariation = await variation.save();
            variationIds.push(savedVariation._id); // เก็บ _id ของ Variation ที่สร้างแล้ว
          }

          productItem.variations = variationIds; // เพิ่มการเชื่อมโยง Variation IDs ไปยัง ProductItem
        }

        const savedProductItem = await productItem.save(); // บันทึก ProductItem ที่สร้างแล้ว
        productItemIds.push(savedProductItem._id); // เก็บ _id ของ ProductItem ที่สร้างแล้ว
      }
      const productItems = product.items.map((item) => item);
      const variations = productItems.map((item) => item.variations);
      const productItemsID = productItems.map((item) => item.id);
      const variationsID = variations
        .map((item) => item.map((variation) => variation.id))
        .flat();

      await this.variationModel.deleteMany({
        _id: variationsID,
      });
      await this.productItemModel.deleteMany({
        _id: productItemsID,
      });

      product.name = updateProductDto.name;
      product.description = updateProductDto.description;
      product.items = productItemIds;
      product.category_id = new Types.ObjectId(
        updateProductDto.category_id,
      ) as any; // แปลง string เป็น ObjectId
      product.supplier_id = new Types.ObjectId(
        updateProductDto.supplier_id,
      ) as any;
      if (updateProductDto.image_banner_adverting) {
        product.image_banner_adverting =
          updateProductDto.image_banner_adverting;
      }
      if (updateProductDto.product_image) {
        product.product_image = updateProductDto.product_image;
      }
    }

    // // อัปเดตข้อมูลสินค้าในฐานข้อมูล
    try {
      return await product.save(); // บันทึก Product ที่อัปเดตแล้ว
    } catch (error) {
      throw new BadRequestException("Failed to update product");
    }
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            isDeleted: new Date(),
          },
        },
      )
      .exec();
    await this.cartModel.updateMany(
      { "items.product_id": id },
      { $pull: { items: { product_id: id } } },
    );
    if (product.product_image) {
      // await this.uploadFileS3Service.deleteImage(product.product_image);
    }
    return product;
  }
}
