import { ConfigService } from "@nestjs/config";
const configService = new ConfigService();

export const allowedOrigins = configService
  .getOrThrow<string>("ALLOWED_ORIGINS")
  .split(",");
