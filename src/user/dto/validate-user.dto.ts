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

  @ApiProperty({ description: "Password for the user", required: false })
  @IsOptional()
  @IsString()
  @Length(5, 50)
  password?: string;
}
