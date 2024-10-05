import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Supplier } from "./schemas/supplier.schema";
import { Model } from "mongoose";
import { SupplierPaginationQueryParamsDto } from "./dto/sup-pagination-query-params.dto";
import { PaginatedDto } from "src/utils/dto/paginated.dto";
import { MongoDBObjectIdPipe } from "src/utils/pipes/mongodb-objectid.pipe";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    private readonly uploadFileS3Service: ManageFileS3Service,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    try {
      return this.supplierModel.create({
        ...createSupplierDto,
        contacts_person_1: {
          con_person: createSupplierDto.contactPerson1,
          email: createSupplierDto.contactEmail1,
          telephone: createSupplierDto.contactTelephone1,
          address: createSupplierDto.contactAddress1,
          con_remark: createSupplierDto.contactRemark1,
        },
        contacts_person_2: {
          con_person: createSupplierDto.contactPerson2,
          email: createSupplierDto.contactEmail2,
          telephone: createSupplierDto.contactTelephone2,
          address: createSupplierDto.contactAddress2,
          con_remark: createSupplierDto.contactRemark2,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    query = "",
  }: SupplierPaginationQueryParamsDto) {
    try {
      const itemCount = await this.supplierModel.countDocuments();

      const suppliers = await this.supplierModel
        .find({
          $or: [{ name: { $regex: query, $options: "i" } }],
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return new PaginatedDto<Supplier>(suppliers, page, limit, itemCount);
    } catch (error) {
      throw error;
    }
  }

  async findOne(supplierId: MongoDBObjectIdPipe) {
    try {
      const supplier = await this.supplierModel.findOne({ _id: supplierId });
      return supplier || [];
    } catch (error) {
      throw error;
    }
  }

  async update(id: MongoDBObjectIdPipe, updateSupplierDto: UpdateSupplierDto) {
    try {
      return await this.supplierModel.findByIdAndUpdate(
        id,
        {
          ...updateSupplierDto,
          contacts_person_1: {
            con_person: updateSupplierDto.contactPerson1,
            email: updateSupplierDto.contactEmail1,
            telephone: updateSupplierDto.contactTelephone1,
            address: updateSupplierDto.contactAddress1,
            con_remark: updateSupplierDto.contactRemark1,
          },
          contacts_person_2: {
            con_person: updateSupplierDto.contactPerson2,
            email: updateSupplierDto.contactEmail2,
            telephone: updateSupplierDto.contactTelephone2,
            address: updateSupplierDto.contactAddress2,
            con_remark: updateSupplierDto.contactRemark2,
          },
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async remove(id: MongoDBObjectIdPipe) {
    try {
      const supplier = await this.supplierModel.findByIdAndDelete(id);
      if (!supplier) {
        throw new NotFoundException("Supplier not found");
      }
      await this.uploadFileS3Service.deleteImage(supplier.profileImage);
      // supplier.imageBanners.map(
      //   async (image) => await this.uploadFileS3Service.deleteImage(image),
      // );
      return supplier;
    } catch (error) {
      throw error;
    }
  }
}
