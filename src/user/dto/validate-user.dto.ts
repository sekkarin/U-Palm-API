import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ValidateUserDto {
  @ApiProperty({ description: "Email address of the user" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "First name of the user", required: false })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  firstName?: string;

  @ApiProperty({ description: "Last name of the user", required: false })
  @IsString()
  @IsOptional()
  @Length(3, 50)
  lastName?: string;

  @ApiProperty({ description: "Password for the user", required: false })
  @IsOptional()
  @IsString()
  @Length(5, 50)
  password?: string;

  @ApiProperty({ description: "photo for the user", required: false })
  @IsOptional()
  @IsString()
  photo?: string;
}
