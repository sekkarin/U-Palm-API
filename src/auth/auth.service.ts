import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UserService,
  ) {}
  async credentialJWT(id: string) {
    try {
      const user = await this.usersService.findOne(id);

      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        user_id: user.id,
        photo: user.photo || "",
      };
      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.getOrThrow<string>(
          "jwt.expiresRefreshToken",
        ),
        secret: this.configService.getOrThrow<string>("jwt.refreshToken"),
      });
      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.getOrThrow<string>(
          "jwt.expiresAccessToken",
        ),
        secret: this.configService.getOrThrow<string>("jwt.accessToken"),
      });
      return {
        refresh_token,
        access_token,
      };
    } catch (error) {
      throw error;
    }
  }
  async refresh(refreshToken: string) {
    try {
      const verifyToken = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("jwt.refreshToken"),
      });
      const payload = {
        firstName: verifyToken.firstName,
        lastName: verifyToken.lastName,
        email: verifyToken.email,
        roles: verifyToken.roles,
        user_id: verifyToken.user_id,
        photo: verifyToken.photo || "",
      };

      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>("jwt.expiresAccessToken"),
        secret: this.configService.get<string>("jwt.accessToken"),
      });
      return access_token;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException("token expired");
      }

      throw error;
    }
  }
  async getProfile(id: string) {
    return this.usersService.findOne(id);
  }
}
