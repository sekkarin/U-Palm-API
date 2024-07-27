import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { VariationOptionService } from "./variation-option.service";
import { CreateVariationOptionDto } from "./dto/create-variation-option.dto";
import { UpdateVariationOptionDto } from "./dto/update-variation-option.dto";

@Controller("variation-options")
export class VariationOptionController {
  constructor(
    private readonly variationOptionService: VariationOptionService,
  ) {}

  @Post()
  async create(@Body() createVariationOptionDto: CreateVariationOptionDto) {
    return this.variationOptionService.create(createVariationOptionDto);
  }

  @Get()
  async findAll() {
    return this.variationOptionService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.variationOptionService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateVariationOptionDto: UpdateVariationOptionDto,
  ) {
    return this.variationOptionService.update(id, updateVariationOptionDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.variationOptionService.remove(id);
  }
}
