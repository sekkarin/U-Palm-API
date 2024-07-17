import { Controller, Get, UseGuards, Request, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleOAuthGuard } from "./guards/google-oauth.guard";
import { AuthenticatedGuard } from "./guards/auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("status")
  @UseGuards(AuthenticatedGuard)
  async googleAuth(@Request() req) {
    if (req?.user) {
      return {
        message: "ok",
      };
    }
    return { message: "no" };
  }

  @Get("logout")
  async logout(@Request() req) {
    req.session.destroy((err: any) => {
      console.log(err);
    });
    return { message: "no" };
  }

  @Get("google-redirect")
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
  @Post("/login")
  @UseGuards(LocalAuthGuard)
  async localLogin(@Request() req) {
    return { user: req.user, data: "hello world" };
  }
}
