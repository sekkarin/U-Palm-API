import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Supplier } from "./schemas/supplier.schema";
import { Model } from "mongoose";
import { SupplierPaginationQueryparamsDto } from "./dto/sup-pagination-query-params.dto";
import { PaginatedDto } from "src/utils/dto/paginated.dto";
import { MongoDBObjectIdPipe } from "src/utils/pipes/mongodb-objectid.pipe";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    private readonly uploadFileS3Service: ManageFileS3Service,
  ) {}
  // file image
  async create(createSupplierDto: CreateSupplierDto) {
    try {
      return this.supplierModel.create({
        name: createSupplierDto.name,
        description: createSupplierDto.description,
        imageBanners: createSupplierDto.imageBanners || [],
        profileImage: createSupplierDto.profileImage || "jpg",
      });
    } catch (error) {
      if (createSupplierDto.profileImage) {
        await this.uploadFileS3Service.deleteImage(
          createSupplierDto.profileImage,
        );
      }
      if (createSupplierDto.imageBanners.length > 0) {
        createSupplierDto.imageBanners.map(
          async (imageBanners) =>
            await this.uploadFileS3Service.deleteImage(imageBanners),
        );
      }
      throw error;
    }
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

  async findOne(supplierId: MongoDBObjectIdPipe) {
    try {
      const supplier = await this.supplierModel.findOne({ _id: supplierId });
      return supplier || [];
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: MongoDBObjectIdPipe,
    updateSupplierDto: UpdateSupplierDto,
    files: {
      profileImage?: Express.Multer.File[];
      imageBanners?: Express.Multer.File[];
    },
  ) {
    const supplier = await this.supplierModel.findById(id);

    try {
      if (files.profileImage && files.profileImage.length > 0) {
        if (supplier.profileImage) {
          await this.uploadFileS3Service.deleteImage(supplier.profileImage);
        }
        updateSupplierDto.profileImage =
          await this.uploadFileS3Service.uploadFile(files.profileImage[0]);
      }
      if (files.imageBanners && files.imageBanners.length > 0) {
        if (supplier.imageBanners && supplier.imageBanners.length > 0) {
          for (const imagePath of supplier.imageBanners) {
            await this.uploadFileS3Service.deleteImage(imagePath);
          }
        }
        const imageBanners = await Promise.all(
          files.imageBanners.map(
            async (file) => await this.uploadFileS3Service.uploadFile(file),
          ),
        );
        updateSupplierDto.imageBanners = imageBanners;
      }
      return await this.supplierModel.findByIdAndUpdate(id, updateSupplierDto, {
        new: true,
      });
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
      supplier.imageBanners.map(
        async (image) => await this.uploadFileS3Service.deleteImage(image),
      );
      return supplier;
    } catch (error) {
      throw error;
    }
  }
}
