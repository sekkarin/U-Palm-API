import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Redirect,
  Req,
  UnauthorizedException,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleOAuthGuard } from "./guards/google-oauth.guard";
import { AuthenticatedGuard } from "./guards/auth.guard";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { ValidateUserDto } from "src/user/dto/validate-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";

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
  async logout(@Req() req, @Res() res: Response) {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "logout success" });
  }

  @Get("google-redirect")
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: "Redirects to Google OAuth login" })
  @ApiResponse({
    status: 200,
    description: "Successfully redirected to Google OAuth",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Redirect(process.env.CLIENT_DOMAIN, 302)
  async googleAuthRedirect(@Request() req, @Res() res) {
    try {
      if (req.user) {
        const { access_token, refresh_token } =
          await this.authService.credentialJWT(req.user.id);
        const maxAgeMilliseconds = 60 * 24 * 60 * 60 * 1000;

        res.cookie("refresh_token", refresh_token, {
          httpOnly: false,
          secure: false,
          maxAge: maxAgeMilliseconds,
        });
        return { access_token, refresh_token };
      }
      throw new UnauthorizedException("Invalid credentials for authentication");
    } catch (error) {
      throw error;
    }
  }

  @Get("profile")
  @UseGuards(AuthenticatedGuard)
  async getProfile(@Request() req) {
    const user = await this.authService.getProfile(req.user.user_id);

    return user;
  }

  @Post("/local/login")
  @UseGuards(AuthGuard("localLogin"), LocalAuthGuard)
  @ApiOperation({ summary: "Local login" })
  @ApiBody({ type: ValidateUserDto })
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
  async localLogin(@Request() req, @Res() res) {
    try {
      if (req.user) {
        const { access_token, refresh_token } =
          await this.authService.credentialJWT(req.user.id);
        const maxAgeMilliseconds = 60 * 24 * 60 * 60 * 1000;

        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: false,
          maxAge: maxAgeMilliseconds,
        });

        return res
          .status(200)
          .json({ access_token, refresh_token, user: req.user });
      }
      throw new UnauthorizedException("Invalid credentials for authentication");
    } catch (error) {
      throw error;
    }
  }

  @Post("/local/register")
  @UseGuards(AuthGuard("localRegister"))
  @ApiOperation({ summary: "Local register" })
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
  async localRegister(@Request() req) {
    if (req.user) {
      //TODO: send mail to verified user
      return {
        message: "Registered, Please verify your email address",
      };
    }
    return {
      message: "authentication failed",
    };
  }
  //TODO: reset password
  //TODO: verification user from email

  @Get("refresh")
  async refresh(@Req() req, @Res() res) {
    try {
      const cookies = req.cookies;

      if (!cookies.refresh_token) {
        throw new UnauthorizedException("Refresh token is required");
      }

      const access_token = await this.authService.refresh(
        cookies.refresh_token,
      );

      res.status(200).json({ access_token });
    } catch (error) {
      throw error;
    }
  }
}
