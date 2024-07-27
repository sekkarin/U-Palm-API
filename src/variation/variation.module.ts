import { Module } from "@nestjs/common";
import { VariationService } from "./variation.service";
import { VariationController } from "./variation.controller";
import { VariationOptionController } from "./variation-option.controller";
import { VariationOptionService } from "./variation-option.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Variation, VariationSchema } from "./schemas/variation.schema";
import {
  VariationOption,
  VariationOptionSchema,
} from "./schemas/variation-option.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variation.name, schema: VariationSchema },
      { name: VariationOption.name, schema: VariationOptionSchema },
    ]),
  ],
  controllers: [VariationController, VariationOptionController],
  providers: [VariationService, VariationOptionService],
  exports: [VariationService, VariationOptionService],
})
export class VariationModule {}
