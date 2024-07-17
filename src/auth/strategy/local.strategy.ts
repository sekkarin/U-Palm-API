import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log(email, password);
    const user = {
      email: email,
      password,
      cat: "foo",
    };

    // const user = await this.authService.validateUser(username, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    return user;
  }
}
