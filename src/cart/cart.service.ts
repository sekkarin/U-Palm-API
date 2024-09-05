import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCartItemDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "./schemas/cart.schema";
import { Model, Types } from "mongoose";
import {
  ProductItem,
  ProductItemDocument,
} from "src/products/schemas/product-item.schema";
import {
  Variation,
  VariationDocument,
} from "src/products/schemas/variations.schema";
import { CartItem, CartItemDocument } from "./schemas/cart-item.schema";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>,
    @InjectModel(ProductItem.name)
    private productItemModel: Model<ProductItemDocument>,
    @InjectModel(Variation.name)
    private variationModel: Model<VariationDocument>,
  ) {}

  async getCartByUserId(userId: string) {
    const cart = await this.cartModel
      .find({ user_id: userId })
      // .populate({
      //   path: "items.product_item_id",
      //   model: ProductItem.name,
      //   populate: [
      //     {
      //       path: "variations",
      //       model: Variation.name,
      //     },
      //   ],
      // })
      .exec();

    if (!cart) {
      throw new NotFoundException(`Cart with ID not found`);
    }

    return cart;
  }
  async addCartItem(
    userId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<Cart> {
    // ค้นหา Cart ของผู้ใช้ตาม userId
    let cart = await this.cartModel.findOne({
      user_id: new Types.ObjectId(userId),
    });

    // ถ้ายังไม่มี Cart ให้สร้างใหม่
    if (!cart) {
      cart = new this.cartModel({
        user_id: new Types.ObjectId(userId),
        items: [],
      });
    }

    // ตรวจสอบว่ามีสินค้านี้ในตะกร้าอยู่แล้วหรือไม่ (อ้างอิงตาม product_item_id และ variation_id)
    const existingCartItemIndex = cart.items.findIndex(
      (item) =>
        item.product_item_id.toString() ===
          createCartItemDto.product_item_id.toString() &&
        item.variation_id.toString() ===
          createCartItemDto.variation_id.toString(),
    );

    if (existingCartItemIndex > -1) {
      // ถ้ามีสินค้านี้อยู่ในตะกร้าแล้ว ให้เพิ่มจำนวน (qty)
      cart.items[existingCartItemIndex].qty += createCartItemDto.qty;
    } else {
      // ถ้ายังไม่มีสินค้า ให้เพิ่ม CartItem ใหม่เข้าไปในตะกร้า
      const newCartItem = new this.cartItemModel({
        product_item_id: createCartItemDto.product_item_id,
        qty: createCartItemDto.qty,
        variation_id: createCartItemDto.variation_id,
      });
      cart.items.push(newCartItem);
    }

    try {
      return await cart.save(); // บันทึก Cart ที่อัปเดตแล้ว
    } catch (error) {
      throw new BadRequestException("Failed to add item to cart");
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
