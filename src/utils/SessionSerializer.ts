import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "src/user/user.service";
type Done = (...args: any[]) => any;
interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roles: [];
  createdAt: string;
  updatedAt: string;

  userId: string;
}
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user: any, done: Done) {
    done(null, user);
  }
  async deserializeUser(payload: UserPayload, done: Done) {
    try {
      const user = await this.userService.findOne(payload.userId);

      const userDeserialized = {
        userId: user.id,
        email: user.email,
        roles: user.roles,
      };

      return userDeserialized ? done(null, userDeserialized) : done(null, null);
    } catch (error) {
      done(null, null);
    }
  }
}
