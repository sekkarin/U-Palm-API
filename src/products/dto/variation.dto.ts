import { IsString, IsNotEmpty } from "class-validator";

export class VariationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
