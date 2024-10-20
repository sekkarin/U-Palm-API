import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Put,
} from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { ApiTags } from "@nestjs/swagger";
import { SupplierPaginationQueryParamsDto } from "./dto/sup-pagination-query-params.dto";
import { MongoDBObjectIdPipe } from "src/utils/pipes/mongodb-objectid.pipe";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";

@Controller("suppliers")
@ApiTags("Suppliers")
export class SuppliersController {
  constructor(
    private readonly suppliersService: SuppliersService,
    private readonly uploadFileS3Service: ManageFileS3Service,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("profileImage", {
      storage: multer.memoryStorage(),
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
          return callback(new BadRequestException("Invalid file type"), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5000000,
      },
    }),
  )
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
    @UploadedFile()
    profileImage: Express.Multer.File,
  ) {
    if (!profileImage) {
      throw new BadRequestException("profileImage is required");
    }
    const profileImageUrl =
      await this.uploadFileS3Service.uploadFile(profileImage);
    createSupplierDto.profileImage = profileImageUrl;
    try {
      return this.suppliersService.create(createSupplierDto);
    } catch (error) {
      this.uploadFileS3Service.deleteImage(profileImageUrl);
      throw error;
    }
  }

  @Get()
  async findSuppliers(
    @Query() supplierPaginationQueryparamsDto: SupplierPaginationQueryParamsDto,
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

  @Get(":supplierId")
  findSupplier(
    @Param("supplierId", MongoDBObjectIdPipe) supplierId: MongoDBObjectIdPipe,
  ) {
    try {
      return this.suppliersService.findOne(supplierId);
    } catch (error) {
      throw error;
    }
  }
  @Get(":supplierId/products")
  findSupplierAndProduct(
    @Param("supplierId", MongoDBObjectIdPipe) supplierId: MongoDBObjectIdPipe,
  ) {
    try {
      return this.suppliersService.findOneAndProducts(supplierId);
    } catch (error) {
      throw error;
    }
  }

  @Put(":supplierId")
  @UseInterceptors(
    FileInterceptor("profileImage", {
      storage: multer.memoryStorage(),
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
          return callback(new BadRequestException("Invalid file type"), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5000000,
      },
    }),
  )
  async updateSupplier(
    @Param("supplierId", MongoDBObjectIdPipe) supplierId: MongoDBObjectIdPipe,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    let profileImageUrl = "";
    if (profileImage) {
      profileImageUrl = await this.uploadFileS3Service.uploadFile(profileImage);
      updateSupplierDto.profileImage = profileImageUrl;
    }
    try {
      return this.suppliersService.update(supplierId, updateSupplierDto);
    } catch (error) {
      this.uploadFileS3Service.deleteImage(profileImageUrl);
      throw error;
    }
  }

  @Delete(":supplierId")
  removeSupplier(
    @Param("supplierId", MongoDBObjectIdPipe) supplierId: MongoDBObjectIdPipe,
  ) {
    return this.suppliersService.remove(supplierId);
  }
  // TODO: Add image by supplierId
  // TODO: Delete image by supplierId
}
