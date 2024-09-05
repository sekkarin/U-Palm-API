import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartItemDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { Request } from "express";
import { AuthenticatedGuard } from "src/auth/guards/auth.guard";

@Controller("carts")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  addCartItem(@Req() req: Request, @Body() createCartDto: CreateCartItemDto) {
    const userId = req.user["user_id"];

    return this.cartService.addCartItem(userId, createCartDto);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  findAll(@Req() req: Request) {
    const userId = req.user["user_id"];
    return this.cartService.getCartByUserId(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cartService.remove(+id);
  }
}
