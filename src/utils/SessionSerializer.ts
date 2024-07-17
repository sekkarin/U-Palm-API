import { PassportSerializer } from "@nestjs/passport";
type Done = (...args: any[]) => any;
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super();
  }
  serializeUser(user: any, done: Done) {
    done(null, user);
  }
  deserializeUser(payload: any, done: Done) {
    if (payload) {
      const user = { id: payload.id, name: payload.name, email: payload.email };
      return done(null, user);
    }

    return done(null, null);
  }
}
