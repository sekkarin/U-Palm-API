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
import { ProductItemService } from "./product-item.service";
import { CreateProductItemDto } from "./dto/create-product-item.dto";
import { UpdateProductItemDto } from "./dto/update-product-item.dto";
import { MongoDBObjectIdPipe } from "src/utils/pipes/mongodb-objectid.pipe";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";

@Controller("product-items")
export class ProductItemController {
  constructor(private readonly productItemService: ProductItemService) {}

  @Post()
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
  async create(
    @Body() createProductItemDto: CreateProductItemDto,
    @UploadedFiles()
    files: {
      product_image?: Express.Multer.File[];
    },
  ) {
    try {
      return this.productItemService.create(createProductItemDto, files);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    return this.productItemService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", MongoDBObjectIdPipe) id: string) {
    return this.productItemService.findOne(id);
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
    @Body() updateProductItemDto: UpdateProductItemDto,
    @UploadedFiles()
    files: {
      product_image?: Express.Multer.File[];
    },
  ) {
    try {
      return this.productItemService.update(id, updateProductItemDto, files);
    } catch (error) {
      throw error;
    }
  }

  @Delete(":id")
  async remove(@Param("id", MongoDBObjectIdPipe) id: string) {
    return this.productItemService.remove(id);
  }
}
