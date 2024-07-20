import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { plainToClass } from "class-transformer";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { validate } from "class-validator";

@Injectable()
export class LocalRegisterStrategy extends PassportStrategy(
  Strategy,
  "localRegister",
) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: "email", passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const { firstName, lastName } = req.body;

    const registerUserDto = plainToClass(CreateUserDto, {
      email,
      password,
      firstName,
      lastName,
    });
    const errors = await validate(registerUserDto);
    if (errors.length > 0) {
      // Handle validation errors
      const errorsStack = errors
        .map((err) => Object.values(err.constraints))
        .flat();
      throw new BadRequestException(errorsStack);
    }
    const userExists =
      await this.userService.registerUserLocal(registerUserDto);

    return userExists || null;
  }
}
