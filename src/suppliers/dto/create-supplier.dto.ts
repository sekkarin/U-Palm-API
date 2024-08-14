import {
  IsString,
  IsOptional,
  IsNotEmpty,
  Length,
  IsEmail,
} from "class-validator";

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsNotEmpty()
  @Length(1, 50)
  country: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  state: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  city: string;

  @IsString()
  @Length(5, 10)
  zip: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  contactPerson1: string;

  @IsString()
  @Length(3, 50)
  @IsOptional()
  contactPerson2?: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 15)
  contactTelephone1: string;

  @IsString()
  @Length(8, 15)
  @IsOptional()
  contactTelephone2?: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  contactAddress1: string;

  @IsString()
  @Length(3, 255)
  @IsOptional()
  contactAddress2?: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  contactRemark1: string;

  @IsString()
  @Length(3, 50)
  @IsOptional()
  contactRemark2?: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail1: string;

  @IsEmail()
  @IsOptional()
  contactEmail2?: string;
}
