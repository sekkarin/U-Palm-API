import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { ProductConfigurationService } from "./product-configuration.service";
import { CreateProductConfigurationDto } from "./dto/create-product-configuration.dto";
import { UpdateProductConfigurationDto } from "./dto/update-product-configuration.dto";

@Controller("product-configurations")
export class ProductConfigurationController {
  constructor(
    private readonly productConfigurationService: ProductConfigurationService,
  ) {}

  @Post()
  async create(
    @Body() createProductConfigurationDto: CreateProductConfigurationDto,
  ) {
    return this.productConfigurationService.create(
      createProductConfigurationDto,
    );
  }

  @Get()
  async findAll() {
    return this.productConfigurationService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.productConfigurationService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductConfigurationDto: UpdateProductConfigurationDto,
  ) {
    return this.productConfigurationService.update(
      id,
      updateProductConfigurationDto,
    );
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.productConfigurationService.remove(id);
  }
}
