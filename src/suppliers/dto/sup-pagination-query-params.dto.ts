import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class SupplierPaginationQueryparamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit?: number = 10;

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string;
}
