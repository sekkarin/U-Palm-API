import { Injectable } from "@nestjs/common";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Supplier } from "./schemas/supplier.schema";
import { Model } from "mongoose";

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
  //TODO: Get all pagination
  //TODO: search and filter
  findAll() {
    return this.supplierModel.find();
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
