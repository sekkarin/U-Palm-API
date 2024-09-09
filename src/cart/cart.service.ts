import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCartItemDto } from "./dto/create-cart.dto";
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
import { Product } from "src/products/schemas/product.schema";

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
  async getItemsCart(userId: string) {
    const cart = await this.cartModel
      .find({ user_id: userId })
      .populate({
        path: "items.product_item_id",
        model: ProductItem.name,
      })
      .populate({
        path: "items.product_id",
        model: Product.name,
      })
      .populate({
        path: "items.variation_id",
        model: Variation.name,
      })
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
      const newCartItem = new this.cartItemModel({
        product_item_id: createCartItemDto.product_item_id,
        qty: createCartItemDto.qty,
        variation_id: createCartItemDto.variation_id,
        product_id: createCartItemDto.product_id,
      });
      cart.items.push(newCartItem);
    }

    try {
      return await cart.save(); // บันทึก Cart ที่อัปเดตแล้ว
    } catch (error) {
      throw new BadRequestException("Failed to add item to cart");
    }
  }

  async removeItemFromCart(userId: string, productItemId: string) {
    const cart = await this.cartModel.findOne({
      user_id: new Types.ObjectId(userId),
    });

    if (!cart) {
      throw new NotFoundException(`Cart for user ID ${userId} not found`);
    }

    await this.cartItemModel.deleteOne({
      cart_id: cart._id,
      product_item_id: productItemId,
    });

    return this.getItemsCart(userId);
  }
  async adjustItemQuantity(
    userId: string,
    productItemId: string,
    variationId: string,
    qty: number,
  ) {
    const cart = await this.cartModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .exec();

    if (!cart) {
      throw new NotFoundException(`Cart for user ID ${userId} not found`);
    }

    // Find the cart item that matches the productItemId
    const cartItemIndex = cart.items.findIndex(
      (item) =>
        item.product_item_id.toString() === productItemId &&
        item.variation_id.toString() === variationId,
    );
    console.log(variationId);

    if (cartItemIndex !== -1) {
      // Update existing cart item quantity
      cart.items[cartItemIndex].qty = qty;
      if (cart.items[cartItemIndex].qty <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(cartItemIndex, 1);
      }
    }
    // else {
    //   if (qty > 0) {
    //     // Add new item to the cart
    //     cart.items.push({
    //       product_item_id: new Types.ObjectId(productItemId),
    //       qty,
    //       product_id: new ObjectId,
    //       variation_id: new ObjectId
    //     });
    //   }
    // }

    // Save the updated cart
    // await cart.save();

    return await cart.save();
  }
}
