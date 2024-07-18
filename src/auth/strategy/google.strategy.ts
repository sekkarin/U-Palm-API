import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { UserService } from "src/user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly userService: UserService,
    config: ConfigService,
  ) {
    super({
      clientID: config.getOrThrow<string>("googleAuth.clientID"),
      clientSecret: config.getOrThrow<string>("googleAuth.clientSecret"),
      callbackURL: "http://localhost:3000/auth/google-redirect",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const userExists = await this.userService.validateUserGoogle({
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      photo: photos[0].value,
    });

    return userExists || null;
  }
}
