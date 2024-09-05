import { IsString, IsNotEmpty } from "class-validator";

export class CreateVariationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
