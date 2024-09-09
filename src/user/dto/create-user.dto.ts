import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ description: "First name of the user" })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @Matches(/^[ก-๙a-zA-Z]+$/, {
    message: "First name must contain only Thai and English characters",
  })
  firstName: string;

  @ApiProperty({ description: "Last name of the user" })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @Matches(/^[ก-๙a-zA-Z]+$/, {
    message: "Last name must contain only Thai and English characters",
  })
  lastName: string;

  @ApiProperty({ description: "Email address of the user" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Password for the user", required: false })
  // @IsOptional()
  @IsString()
  @Length(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password too weak",
  })
  password?: string;

  @ApiProperty({ description: "photo for the user", required: false })
  @IsOptional()
  @IsString()
  photo?: string;
}
