import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { VariationService } from "./variation.service";
import { CreateVariationDto } from "./dto/create-variation.dto";
import { UpdateVariationDto } from "./dto/update-variation.dto";

@Controller("variations")
export class VariationController {
  constructor(private readonly variationService: VariationService) {}

  @Post()
  async create(@Body() createVariationDto: CreateVariationDto) {
    return this.variationService.create(createVariationDto);
  }

  @Get()
  async findAll() {
    return this.variationService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.variationService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateVariationDto: UpdateVariationDto,
  ) {
    return this.variationService.update(id, updateVariationDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.variationService.remove(id);
  }
}
