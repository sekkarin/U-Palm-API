import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Variation, VariationDocument } from "./schemas/variation.schema";
import { CreateVariationDto } from "./dto/create-variation.dto";
import { UpdateVariationDto } from "./dto/update-variation.dto";

@Injectable()
export class VariationService {
  constructor(
    @InjectModel(Variation.name)
    private variationModel: Model<VariationDocument>,
  ) {}

  async create(createVariationDto: CreateVariationDto): Promise<Variation> {
    const createdVariation = new this.variationModel(createVariationDto);
    return createdVariation.save();
  }

  async findAll(): Promise<Variation[]> {
    return this.variationModel.find().exec();
  }

  async findOne(id: string): Promise<Variation> {
    return this.variationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateVariationDto: UpdateVariationDto,
  ): Promise<Variation> {
    return this.variationModel
      .findByIdAndUpdate(id, updateVariationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Variation> {
    return this.variationModel.findByIdAndDelete(id).exec();
  }
}
