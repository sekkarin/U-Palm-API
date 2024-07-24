import { Module } from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { SuppliersController } from "./suppliers.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Supplier, SupplierSchema } from "./schemas/supplier.schema";
import { ManageFileS3Service } from "src/utils/services/up-load-file-s3.service";

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, ManageFileS3Service],
  imports: [
    MongooseModule.forFeature([
      {
        name: Supplier.name,
        schema: SupplierSchema,
      },
    ]),
  ],
})
export class SuppliersModule {}
