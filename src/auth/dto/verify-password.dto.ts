import { IsNotEmpty, IsString, Matches } from "class-validator";

export class VerifyResetPassword {
  @IsString()
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "รหัสยังไม่ปลอดภัย!",
  })
  new_password: string;
}
