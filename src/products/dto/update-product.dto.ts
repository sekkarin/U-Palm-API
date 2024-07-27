export class UpdateProductDto {
  readonly name?: string;
  readonly description?: string;
  readonly product_image?: string;
  readonly category_id?: string;
  readonly supplier?: string; // เพิ่มฟิลด์ supplier
}
