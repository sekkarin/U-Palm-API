import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsArray,
  IsMongoId,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ProductItemDto } from "./product-item.dto";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  product_image?: string;

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
