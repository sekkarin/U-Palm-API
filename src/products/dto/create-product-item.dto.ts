import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateProductItemDto {
  @IsString()
  @IsNotEmpty()
  readonly product_id: string;
  @IsString()
  @IsNotEmpty()
  readonly SKU: string;
  @IsNumber()
  @IsNotEmpty()
  readonly qty_in_stock: number;
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
