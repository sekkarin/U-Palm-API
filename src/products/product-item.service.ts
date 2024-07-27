import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ProductItem,
  ProductItemDocument,
} from "./schemas/product-item.schema";
import { CreateProductItemDto } from "./dto/create-product-item.dto";
import { UpdateProductItemDto } from "./dto/update-product-item.dto";

@Injectable()
export class ProductItemService {
  constructor(
    @InjectModel(ProductItem.name)
    private productItemModel: Model<ProductItemDocument>,
  ) {}

  async create(
    createProductItemDto: CreateProductItemDto,
  ): Promise<ProductItem> {
    const createdProductItem = new this.productItemModel(createProductItemDto);
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
  ): Promise<ProductItem> {
    return this.productItemModel
      .findByIdAndUpdate(id, updateProductItemDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ProductItem> {
    return this.productItemModel.findByIdAndDelete(id).exec();
  }
}
