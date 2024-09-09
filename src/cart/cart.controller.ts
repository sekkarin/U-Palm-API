import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartItemDto } from "./dto/create-cart.dto";
import { Request } from "express";
import { AuthenticatedGuard } from "src/auth/guards/auth.guard";

@Controller("carts")
@UseGuards(AuthenticatedGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addCartItem(@Req() req: Request, @Body() createCartDto: CreateCartItemDto) {
    const userId = req.user["user_id"];

    return this.cartService.addCartItem(userId, createCartDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = req.user["user_id"];
    return this.cartService.getCartByUserId(userId);
  }
  @Get("get-items-cart")
  getItemsCart(@Req() req: Request) {
    const userId = req.user["user_id"];
    return this.cartService.getItemsCart(userId);
  }

  @Post("adjust")
  async adjustItem(
    @Body("productItemId") productItemId: string,
    @Body("variationId") variationId: string,
    @Body("qty", ParseIntPipe) qty: number,
    @Req() req: Request,
  ) {
    const userId = req.user["user_id"];
    return this.cartService.adjustItemQuantity(
      userId,
      productItemId,
      variationId,
      qty,
    );
  }

  @Delete("remove")
  async removeItem(
    @Body("userId") userId: string,
    @Body("productItemId") productItemId: string,
  ) {
    return this.cartService.removeItemFromCart(userId, productItemId);
  }
}
