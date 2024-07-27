import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  VariationOption,
  VariationOptionDocument,
} from "./schemas/variation-option.schema";
import { CreateVariationOptionDto } from "./dto/create-variation-option.dto";
import { UpdateVariationOptionDto } from "./dto/update-variation-option.dto";

@Injectable()
export class VariationOptionService {
  constructor(
    @InjectModel(VariationOption.name)
    private variationOptionModel: Model<VariationOptionDocument>,
  ) {}

  async create(
    createVariationOptionDto: CreateVariationOptionDto,
  ): Promise<VariationOption> {
    const createdVariationOption = new this.variationOptionModel(
      createVariationOptionDto,
    );
    return createdVariationOption.save();
  }

  async findAll(): Promise<VariationOption[]> {
    return this.variationOptionModel.find().exec();
  }

  async findOne(id: string): Promise<VariationOption> {
    return this.variationOptionModel.findById(id).exec();
  }

  async update(
    id: string,
    updateVariationOptionDto: UpdateVariationOptionDto,
  ): Promise<VariationOption> {
    return this.variationOptionModel
      .findByIdAndUpdate(id, updateVariationOptionDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<VariationOption> {
    return this.variationOptionModel.findByIdAndDelete(id).exec();
  }
}
