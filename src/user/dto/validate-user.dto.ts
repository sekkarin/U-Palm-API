import { IsEmail, IsNotEmpty } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ValidateUserDto {
  @ApiProperty({ description: "Email address of the user" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
