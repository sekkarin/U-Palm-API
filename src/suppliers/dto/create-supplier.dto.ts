import { Supplier } from "../schemas/supplier.schema";

export class CreateSupplierDto extends Supplier {
  description?: string;
  imageBanners: [{ type: string }];
  name: string;
  profileImage: { type: string; required: true };
}
