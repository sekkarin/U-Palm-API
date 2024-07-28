import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateProductDto {
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @Length(3, 255)
  @IsOptional()
  readonly description?: string;
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  readonly category_id: string;
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  readonly supplier_id: string; // เพิ่มฟิลด์ supplier
}
