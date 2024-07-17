import { Controller, Get, UseGuards, Request, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleOAuthGuard } from "./guards/google-oauth.guard";
import { AuthenticatedGuard } from "./guards/auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get("logout")
  @UseGuards(AuthenticatedGuard)
  async logout(@Request() req) {
    req.session.destroy((err: any) => {
      console.log(err);
    });
    return { message: "logout success" };
  }

  @Get("google-redirect")
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
  @Post("/local/authentication")
  @UseGuards(LocalAuthGuard)
  async localAuthentication(@Request() req) {
    if (req.user) {
      //TODO: send mail to verified user
      return {
        message: "User information from local",
        user: req.user,
      };
    }
    return {
      message: "authentication failed",
    };
  }
  //TODO: reset password
  //TODO: verification user from email
}
