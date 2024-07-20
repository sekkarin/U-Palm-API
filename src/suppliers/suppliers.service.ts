import { Injectable } from "@nestjs/common";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Supplier } from "./schemas/supplier.schema";
import { Model } from "mongoose";
import { SupplierPaginationQueryparamsDto } from "./dto/sup-pagination-query-params.dto";
import { PaginatedDto } from "src/utils/dto/paginated.dto";

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {}
  create(createSupplierDto: CreateSupplierDto) {
    return this.supplierModel.create({
      name: createSupplierDto.name,
      description: createSupplierDto.description,
      imageBanners: createSupplierDto.imageBanners,
      profileImage: createSupplierDto.profileImage,
    });
  }

  async findAll({
    page = 1,
    limit = 1,
    query = "",
  }: SupplierPaginationQueryparamsDto) {
    try {
      const itemCount = await this.supplierModel.countDocuments();

      const suppliers = await this.supplierModel
        .find({
          $or: [{ name: { $regex: query, $options: "i" } }],
        })
        .skip((page - 1) * limit)
        .limit(limit);

      return new PaginatedDto<Supplier>(suppliers, page, limit, itemCount);
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
