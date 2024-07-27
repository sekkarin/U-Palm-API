import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { ProductItemService } from "./product-item.service";
import { CreateProductItemDto } from "./dto/create-product-item.dto";
import { UpdateProductItemDto } from "./dto/update-product-item.dto";

@Controller("product-items")
export class ProductItemController {
  constructor(private readonly productItemService: ProductItemService) {}

  @Post()
  async create(@Body() createProductItemDto: CreateProductItemDto) {
    return this.productItemService.create(createProductItemDto);
  }

  @Get()
  async findAll() {
    return this.productItemService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.productItemService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProductItemDto: UpdateProductItemDto,
  ) {
    return this.productItemService.update(id, updateProductItemDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.productItemService.remove(id);
  }
}
