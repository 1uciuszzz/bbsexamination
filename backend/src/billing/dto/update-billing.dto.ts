import { BillingCategory, BillingType } from "@prisma/client";

export class UpdateBillingDto {
  name: string;
  amount: number;
  type: BillingType;
  category: BillingCategory;
  time: string;
}
