import {
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { VariationDto } from "./variation.dto";

export class ProductItemDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  qty_in_stock: number;

  // @IsString()
  // @IsOptional()
  // product_image_item?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  base_price: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  qty_discount: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  shipping: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  profit: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationDto)
  @IsOptional()
  variations?: VariationDto[];
}
