import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ProductConfiguration,
  ProductConfigurationDocument,
} from "./schemas/product-configuration.schema";
import { CreateProductConfigurationDto } from "./dto/create-product-configuration.dto";
import { UpdateProductConfigurationDto } from "./dto/update-product-configuration.dto";

@Injectable()
export class ProductConfigurationService {
  constructor(
    @InjectModel(ProductConfiguration.name)
    private productConfigurationModel: Model<ProductConfigurationDocument>,
  ) {}

  async create(
    createProductConfigurationDto: CreateProductConfigurationDto,
  ): Promise<ProductConfiguration> {
    const createdProductConfiguration = new this.productConfigurationModel(
      createProductConfigurationDto,
    );
    return createdProductConfiguration.save();
  }

  async findAll(): Promise<ProductConfiguration[]> {
    return this.productConfigurationModel.find().exec();
  }

  async findOne(id: string): Promise<ProductConfiguration> {
    return this.productConfigurationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateProductConfigurationDto: UpdateProductConfigurationDto,
  ): Promise<ProductConfiguration> {
    return this.productConfigurationModel
      .findByIdAndUpdate(id, updateProductConfigurationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ProductConfiguration> {
    return this.productConfigurationModel.findByIdAndDelete(id).exec();
  }
}
