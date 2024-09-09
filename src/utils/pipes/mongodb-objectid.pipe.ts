import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class MongoDBObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const isValidObjectId = Types.ObjectId.isValid(value);
    if (!isValidObjectId) {
      throw new BadRequestException("Invalid ObjectId format");
    }
    return value;
  }
}
