import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { ProductCategoryService } from "./product-category.service";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { SupplierPaginationQueryParamsDto } from "src/suppliers/dto/sup-pagination-query-params.dto";

@Controller("categories")
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateProductCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(
    @Query() supplierPaginationQueryParamsDto: SupplierPaginationQueryParamsDto,
  ) {
    try {
      return this.categoryService.findAll(supplierPaginationQueryParamsDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.categoryService.remove(id);
  }
}
