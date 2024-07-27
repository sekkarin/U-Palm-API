export class CreateProductItemDto {
  readonly product_id: string;
  readonly SKU: string;
  readonly qty_in_stock: number;
  readonly product_image?: string;
  readonly price: number;
}
