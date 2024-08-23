import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./schemas/product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly uploadFileS3Service: ManageFileS3Service,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    //TODO: not save
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate("category_id").exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel
      .findById(id)
      .populate("category_id supplier_id")
      .exec();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files: {
      product_image?: Express.Multer.File[];
    },
  ): Promise<Product> {
    let productImage: undefined | string;
    const product = await this.productModel.findOne({ _id: id });

    // if (files.product_image.length > 0) {
    //   await this.uploadFileS3Service.deleteImage(product.product_image);
    //   productImage = await this.uploadFileS3Service.uploadFile(
    //     files.product_image[0],
    //   );
    // }

    return this.productModel
      .findByIdAndUpdate(
        id,
        { ...updateProductDto, product_image: productImage },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (product.product_image) {
      // await this.uploadFileS3Service.deleteImage(product.product_image);
    }
    return product;
  }
}
