import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCartItemDto {
  @IsMongoId()
  @IsNotEmpty()
  product_item_id: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsMongoId()
  @IsNotEmpty()
  variation_id: Types.ObjectId;
}
