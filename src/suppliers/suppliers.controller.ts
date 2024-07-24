import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SupplierPaginationQueryparamsDto } from "./dto/sup-pagination-query-params.dto";
import { MongoDBObjectIdPipe } from "src/utils/pipes/mongodb-objectid.pipe";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
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
  @ApiOperation({ summary: "Create a new supplier" })
  @ApiResponse({
    status: 201,
    description: "The supplier has been successfully created.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 400, description: "Invalid input." })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "profileImage", maxCount: 1 },
        { name: "imageBanners", maxCount: 20 },
      ],
      {
        storage: multer.memoryStorage(),
        fileFilter(req, file, callback) {
          if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return callback(
              new BadRequestException("Invalid file type"),
              false,
            );
          }
          callback(null, true);
        },
        limits: {
          fileSize: 5000000,
        },
      },
    ),
  )
  async createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
    @UploadedFiles()
    files: {
      profileImage?: Express.Multer.File[];
      imageBanners?: Express.Multer.File[];
    },
  ) {
    let profileImageUrl: string = "";
    let imageBannersUrl: string[] = [];

    if (!files.profileImage) {
      throw new BadRequestException("profileImage is required");
    }
    if (!files.imageBanners) {
      throw new BadRequestException("imageBanners is required");
    }

    profileImageUrl = await this.uploadFileS3Service.uploadFile(
      files.profileImage[0],
    );

    imageBannersUrl = await Promise.all(
      files.imageBanners.map((file) => {
        return this.uploadFileS3Service.uploadFile(file);
      }),
    );

    return this.suppliersService.create({
      ...createSupplierDto,
      profileImage: profileImageUrl,
      imageBanners: imageBannersUrl,
    });
  }

  @Get()
  async findSuppliers(
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

  @Patch(":supplierId")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "profileImage", maxCount: 1 },
        { name: "imageBanners", maxCount: 20 },
      ],
      {
        storage: multer.memoryStorage(),
        fileFilter(req, file, callback) {
          if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return callback(
              new BadRequestException("Invalid file type"),
              false,
            );
          }
          callback(null, true);
        },
        limits: {
          fileSize: 5000000,
        },
      },
    ),
  )
  updateSupplier(
    @Param("supplierId", MongoDBObjectIdPipe) supplierId: MongoDBObjectIdPipe,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @UploadedFiles()
    files: {
      profileImage?: Express.Multer.File[];
      imageBanners?: Express.Multer.File[];
    },
  ) {
    return this.suppliersService.update(supplierId, updateSupplierDto, files);
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
