import { MailerService } from "@nestjs-modules/mailer";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as crypto from "node:crypto";
import * as bcrypt from "bcrypt";

import { User, UserDocument } from "src/user/schemas/user.schema";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UserService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  public async sendEmailResetPassword(email: string) {
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      throw new NotFoundException("Invalid send email reset password");
    }
    const cached = await this.cacheManager.get<{
      code: string;
      id: string;
    }>(`reset-pwd-${user._id}`);
    if (cached) {
      this.verifyResetPassword(user._id.toString(), cached.code, "123");
      throw new BadRequestException(
        "คุณทำการเปลี่ยนรหัสไปแล้ว โปรดรอสักครู่ในการเปลี่ยนรหัสผ่าน",
      );
    }

    const payload = {
      userId: user.id,
      code: crypto.randomUUID(),
    };

    await this.cacheManager.set(
      `reset-pwd-${user._id}`,
      payload,
      1000 * 60 * 10,
    );
    try {
      const clientURL = this.configService.getOrThrow<string>("client.baseUrl");

      const href = `${clientURL}/verify-reset-password/${user._id}/${payload.code}`;
      await this.mailerService.sendMail({
        to: email,
        subject: "Reset Password U Palm ",
        template: "reset-pwd",
        context: {
          href: href,
          username: user.firstName,
        },
      });
      return {
        message: "โปรดตรวจสอบที่ Email ของคุณ",
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifyResetPassword(
    id: string,
    code: string,
    newPassword: string,
  ) {
    try {
      const cached = await this.cacheManager.get<{
        code: string;
        id: string;
      }>(`reset-pwd-${id}`);

      if (!cached) {
        throw new BadRequestException("ไม่สามมารถเปลี่ยนรหัสผ่านได้!");
      }
      if (cached.code !== code) {
        throw new ForbiddenException("ไม่สามมารถเปลี่ยนรหัสผ่านได้!");
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      const user = await this.userModel.findOne({ _id: id });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      this.cacheManager.del(`reset-pwd-${id}`);
      user.password = passwordHash;
      await user.save();

      return {
        message: "เปลี่ยนรหัสผ่านได้สำเร็จ!",
      };
    } catch (error) {
      throw error;
    }
  }
}
