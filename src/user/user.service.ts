import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { ValidateUserDto } from "./dto/validate-user.dto";

@Injectable()
export class UserService {
  private salt = 10;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUserLocal(createUserDto: CreateUserDto) {
    try {
      let passwordHash: string | undefined;

      const userExists = await this.userModel.findOne({
        email: createUserDto.email,
      });

      if (userExists) {
        throw new ConflictException("Email already exists");
      }

      if (createUserDto.password) {
        passwordHash = await bcrypt.hash(createUserDto.password, this.salt);
      }
      const user = await this.userModel.create({
        ...createUserDto,
        password: passwordHash,
        isVerifiedAccount: true,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async createUserGoogle(createUserDto: CreateUserDto) {
    try {
      let passwordHash: string | undefined;
      const userExists = await this.userModel.findOne({
        email: createUserDto.email,
      });

      if (userExists) {
        throw new ConflictException("Email already exists");
      }

      if (createUserDto.password) {
        passwordHash = await bcrypt.hash(createUserDto.password, this.salt);
      }
      const user = await this.userModel.create({
        ...createUserDto,
        password: passwordHash,
        isVerifiedAccount: true,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user` + updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  public async registerUserLocal(userInfo: CreateUserDto) {
    try {
      const userExists = await this.userModel
        .findOne({
          email: userInfo.email,
        })
        .select("+password");

      if (!userExists?.isVerifiedAccount && userExists) {
        throw new UnauthorizedException("Please verify your account.");
      }

      return this.createUserLocal(userInfo as CreateUserDto);
    } catch (error) {
      throw error;
    }
  }
  public async loginUserLocal(userInfo: ValidateUserDto) {
    try {
      const userExists = await this.userModel
        .findOne({
          email: userInfo.email,
        })
        .select("+password");

      if (!userExists) {
        throw new UnauthorizedException("User does not exist");
      }

      if (!userExists?.password) {
        throw new UnauthorizedException("Please reset your password");
      }
      const passwordIsMatch = await bcrypt.compare(
        userInfo.password,
        userExists.password,
      );

      if (!passwordIsMatch) {
        throw new UnauthorizedException("Password is not a valid.");
      }

      return userExists;
    } catch (error) {
      throw error;
    }
  }

  public async validateUserGoogle(userInfo: ValidateUserDto | CreateUserDto) {
    try {
      const userExists = await this.userModel
        .findOne({
          email: userInfo.email,
        })
        .select("+password");

      if (userExists) return userExists;
      return this.createUserGoogle(userInfo as CreateUserDto);
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }
  // TODO: update role
  // TODO: authorization  with casl
}
