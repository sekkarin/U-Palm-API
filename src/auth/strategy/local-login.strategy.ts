import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "src/user/user.service";

@Injectable()
export class LocalLoginStrategy extends PassportStrategy(
  Strategy,
  "localLogin",
) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<any> {
    const userExists = await this.userService.loginUserLocal({
      email: email,
      password: password,
    });

    return userExists || null;
  }
}
