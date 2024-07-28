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

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(
    FileFieldsInterceptor([{ name: "product_image", maxCount: 1 }], {
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
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      product_image?: Express.Multer.File[];
    },
  ) {
    try {
      return this.productService.create(createProductDto, files);
    } catch (error) {
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
      limits: {
        fileSize: 5000000,
      },
    }),
  )
  async update(
    @Param("id", MongoDBObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      product_image?: Express.Multer.File[];
    },
  ) {
    try {
      return this.productService.update(id, updateProductDto, files);
    } catch (error) {
      throw error;
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.productService.remove(id);
  }
}
