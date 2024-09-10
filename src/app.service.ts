import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user/schemas/user.schema";
import { Model } from "mongoose";
import { ProductDocument } from "./products/schemas/product.schema";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private userModel: Model<ProductDocument>,
    private configService: ConfigService,
  ) {}
  async onApplicationBootstrap() {
    const seedAdmin = {
      firstName: "UPalm",
      lastName: "Admin",
      email: this.configService.getOrThrow<string>("admin.email"),
      password: this.configService.getOrThrow<string>("admin.password_hashed"),
      roles: [1001, 3001],
      isVerifiedAccount: true,
    };
    try {
      const adminExists = await this.userModel.findOne({
        email: seedAdmin.email,
      });
      if (adminExists) {
        return;
      }
      await this.userModel.insertMany(seedAdmin);
      console.log("Map admin successfully");
    } catch (error) {
      throw error;
    }
  }
}
