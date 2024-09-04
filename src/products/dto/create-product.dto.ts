import { Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsArray,
  IsMongoId,
  ArrayNotEmpty,
  ValidateNested,
} from "class-validator";
import { ProductItemDto } from "./product-item.dto";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true }) // Validate each entry in the array as a string
  @ArrayNotEmpty() // Ensures the array is not empty
  @IsNotEmpty()
  @IsOptional()
  product_image?: string[];

  @IsString()
  @IsOptional()
  image_banner_adverting?: string;

  @IsMongoId()
  @IsNotEmpty()
  category_id: string;

  @IsMongoId()
  @IsNotEmpty()
  supplier_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  @IsOptional()
  items?: ProductItemDto[];

}
