import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ProductItem,
  ProductItemDocument,
} from "./schemas/product-item.schema";
import { CreateProductItemDto } from "./dto/create-product-item.dto";
import { UpdateProductItemDto } from "./dto/update-product-item.dto";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";

@Injectable()
export class ProductItemService {
  constructor(
    @InjectModel(ProductItem.name)
    private productItemModel: Model<ProductItemDocument>,
    private readonly uploadFileS3Service: ManageFileS3Service,
  ) {}

  async create(
    createProductItemDto: CreateProductItemDto,
    files: {
      product_image?: Express.Multer.File[];
    },
  ): Promise<ProductItem> {
    if (!files.product_image) {
      throw new BadRequestException("product image is required");
    }
    const productImage = await this.uploadFileS3Service.uploadFile(
      files.product_image[0],
    );
    const createdProductItem = new this.productItemModel({
      ...createProductItemDto,
      product_image: productImage,
    });
    return createdProductItem.save();
  }

  async findAll(): Promise<ProductItem[]> {
    return this.productItemModel.find().exec();
  }

  async findOne(id: string): Promise<ProductItem> {
    return this.productItemModel.findById(id).exec();
  }

  async update(
    id: string,
    updateProductItemDto: UpdateProductItemDto,
    files: {
      product_image?: Express.Multer.File[];
    },
  ): Promise<ProductItem> {
    let productImage: undefined | string;
    const product = await this.productItemModel.findOne({ _id: id });

    if (files.product_image.length > 0) {
      await this.uploadFileS3Service.deleteImage(product.product_image);
      productImage = await this.uploadFileS3Service.uploadFile(
        files.product_image[0],
      );
    }
    return this.productItemModel
      .findByIdAndUpdate(
        id,
        { ...updateProductItemDto, product_image: productImage },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<ProductItem> {
    const productItem = await this.productItemModel
      .findByIdAndDelete(id)
      .exec();
    if (productItem.product_image) {
      await this.uploadFileS3Service.deleteImage(productItem.product_image);
    }
    return productItem;
  }
}
