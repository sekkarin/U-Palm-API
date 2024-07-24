import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsNotEmpty, Length } from "class-validator";

export class CreateSupplierDto {
  @ApiProperty({
    description: "Name of the supplier",
    example: "Supplier ABC",
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @ApiProperty({ type: "string", format: "binary", required: true })
  profileImage: any;

  @ApiPropertyOptional({
    description: "Description of the supplier",
    example: "This is a supplier that provides various products.",
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: "Array of image banners",
    format: "binary",
    example: [
      "https://example.com/banner1.jpg",
      "https://example.com/banner2.jpg",
    ],
    required: true,
  })
  imageBanners: any[];
}
