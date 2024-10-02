import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from "@nestjs/common";
import { ProductService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import * as multer from "multer";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { MongoDBObjectIdPipe } from "src/utils/pipes/mongodb-objectid.pipe";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadFileS3Service: ManageFileS3Service,
  ) {}

  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "product_image", maxCount: 10 },
        {
          name: "image_banner_adverting",
          maxCount: 1,
        },
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
      },
    ),
  )
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      image_banner_adverting?: Express.Multer.File[];
      product_image?: Express.Multer.File[];
    },
  ) {
    if (!files.product_image) {
      throw new BadRequestException("Product image not found");
    }
    if (!files.image_banner_adverting) {
      throw new BadRequestException("Product image banner not found");
    }
    createProductDto.image_banner_adverting =
      await this.uploadFileS3Service.uploadFile(
        files.image_banner_adverting[0],
      );
    createProductDto.product_image = await Promise.all(
      files.product_image.map(
        async (image) => await this.uploadFileS3Service.uploadFile(image),
      ),
    );
    try {
      return this.productService.create(createProductDto);
    } catch (error) {
      await this.uploadFileS3Service.deleteImage(
        createProductDto.image_banner_adverting,
      );
      createProductDto.product_image.map(
        async (image) => await this.uploadFileS3Service.deleteImage(image),
      );
      throw error;
    }
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", MongoDBObjectIdPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Put(":id")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "product_image", maxCount: 1 }], {
      storage: multer.memoryStorage(),
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
          return callback(new BadRequestException("Invalid file type"), false);
        }
        callback(null, true);
      },
    }),
  )
  async update(
    @Param("id", MongoDBObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      image_banner_adverting?: Express.Multer.File[];
      product_image?: Express.Multer.File[];
    },
  ) {
    if (files.image_banner_adverting) {
      const imageUrl = await this.uploadFileS3Service.uploadFile(
        files.image_banner_adverting[0],
      );
      updateProductDto.image_banner_adverting = imageUrl;
    }
    if (files.product_image && files.product_image.length > 0) {
      const imageUrls = await Promise.all(
        files.product_image.map(
          async (image) => await this.uploadFileS3Service.uploadFile(image),
        ),
      );
      updateProductDto.product_image = imageUrls;
    }
    try {
      return this.productService.update(id, updateProductDto);
    } catch (error) {
      await this.uploadFileS3Service.deleteImage(
        updateProductDto.image_banner_adverting,
      );
      updateProductDto.product_image.map(
        async (image) => await this.uploadFileS3Service.deleteImage(image),
      );
      throw error;
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.productService.remove(id);
  }
}
