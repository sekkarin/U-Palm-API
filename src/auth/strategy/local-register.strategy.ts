import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Request } from "express";
import { UserService } from "src/user/user.service";

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
    const userExists = await this.userService.registerUserLocal({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    return userExists || null;
  }
}
