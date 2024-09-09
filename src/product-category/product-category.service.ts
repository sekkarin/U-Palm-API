import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ProductCategory,
  ProductCategoryDocument,
} from "./schemas/product-category.schema";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { SupplierPaginationQueryParamsDto } from "src/suppliers/dto/sup-pagination-query-params.dto";
import { PaginatedDto } from "src/utils/dto/paginated.dto";

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

  async findAll({
    page = 1,
    limit = 1,
    query = "",
  }: SupplierPaginationQueryParamsDto): Promise<PaginatedDto<ProductCategory>> {
    try {
      const itemCount = await this.categoryModel.countDocuments();
      const categories = await this.categoryModel
        .find({
          $or: [{ category_name: { $regex: query, $options: "i" } }],
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return new PaginatedDto<ProductCategory>(
        categories,
        page,
        limit,
        itemCount,
      );
    } catch (error) {
      throw error;
    }
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
