import {
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { VariationDto } from "./variation.dto";

export class ProductItemDto {
  @IsNumber()
  @IsNotEmpty()
  qty_in_stock: number;

  @IsString()
  @IsOptional()
  product_image?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  qty_discount: number;

  @IsNumber()
  @IsNotEmpty()
  shipping: number;

  @IsNumber()
  @IsNotEmpty()
  profit: number;

  @IsNumber()
  @IsNotEmpty()
  selling_price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationDto)
  @IsOptional()
  variations?: VariationDto[];
}
