export class CreateProductDto {
  readonly name: string;
  readonly description?: string;
  readonly product_image?: string;
  readonly categoryId: string;
  readonly supplierId: string; // เพิ่มฟิลด์ supplier
}
