import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateSupplierDto {
  @ApiProperty({
    description: "Name of the supplier",
    example: "Supplier ABC",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Profile image URL of the supplier",
    example: "https://example.com/profile.jpg",
  })
  @IsString()
  profileImage: string;

  @ApiPropertyOptional({
    description: "Description of the supplier",
    example: "This is a supplier that provides various products.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Array of image banners",

    example: [
      "https://example.com/banner1.jpg",
      "https://example.com/banner2.jpg",
    ],
  })
  imageBanners: string[];
}

// class Banner {
//   @ApiProperty({
//     description: "URL of the banner image",
//     example: "https://example.com/banner.jpg",
//   })
//   @IsString()
//   type: string;
// }
