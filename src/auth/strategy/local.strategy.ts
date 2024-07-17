import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Request } from "express";
import * as bcrypt from "bcrypt";
import { UserService } from "src/user/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: "email", passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const { firstName, lastName } = req.body;
    const userExists = await this.userService.validateUser(
      {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      },
      "local",
    );
    if (!userExists.isVerifiedAccount) {
      throw new UnauthorizedException("Please verify your account.");
    }
    const passwordIsMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordIsMatch) {
      throw new UnauthorizedException("Password is not a valid.");
    }

    return userExists || null;
  }
}
