import { Controller, Get, UseGuards, Request, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleOAuthGuard } from "./guards/google-oauth.guard";
import { AuthenticatedGuard } from "./guards/auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("logout")
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: "Logs out the user" })
  @ApiResponse({
    status: 200,
    description: "Successfully logged out",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async logout(@Request() req) {
    req.session.destroy((err: any) => {
      if (err) {
        console.log(err);
      }
    });
    return { message: "logout success" };
  }

  @Get("google-redirect")
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: "Redirects to Google OAuth login" })
  @ApiResponse({
    status: 200,
    description: "Successfully redirected to Google OAuth",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
  @Post("/local/authentication")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Local authentication" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: "User information from local",
    schema: {
      example: {
        message: "User information from local",
        user: {
          email: "user@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Authentication failed",
    schema: {
      example: {
        message: "authentication failed",
      },
    },
  })
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
