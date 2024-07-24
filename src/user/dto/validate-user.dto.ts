import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ValidateUserDto {
  @ApiProperty({ description: "Email address of the user" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Password for the user", required: true })
  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;
}
