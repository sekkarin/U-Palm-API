import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ProductCategory,
  ProductCategoryDocument,
} from "./schemas/product-category.schema";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name)
    private categoryModel: Model<ProductCategoryDocument>,
  ) {}

  async create(
    createCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<ProductCategory[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<ProductCategory> {
    return this.categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ProductCategory> {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
