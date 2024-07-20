import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SupplierPaginationQueryparamsDto } from "./dto/sup-pagination-query-params.dto";

@Controller("suppliers")
@ApiTags("Suppliers")
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new supplier" })
  @ApiResponse({
    status: 201,
    description: "The supplier has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Invalid input." })
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  async findAll(
    @Query() supplierPaginationQueryparamsDto: SupplierPaginationQueryparamsDto,
  ) {
    try {
      const suppliers = await this.suppliersService.findAll(
        supplierPaginationQueryparamsDto,
      );
      return suppliers;
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.suppliersService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.suppliersService.remove(+id);
  }
}
