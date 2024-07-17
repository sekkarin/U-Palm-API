import { ConflictException, Injectable } from "@nestjs/common";
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

  async create(createUserDto: CreateUserDto) {
    try {
      let passwordHash: string | undefined;
      const userExists = await this.userModel.find({
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
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  public async validateUser(userInfo: ValidateUserDto | CreateUserDto) {
    try {
      const userExists = await this.userModel.findOne({
        email: userInfo.email,
      });

      if (userExists) return userExists;
      const newUser = this.userModel.create(userInfo);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }
}
