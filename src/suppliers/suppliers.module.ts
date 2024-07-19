import { Module } from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { SuppliersController } from "./suppliers.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Supplier, SupplierSchema } from "./schemas/supplier.schema";

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
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
