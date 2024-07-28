import { BillingCategory, BillingType } from "@prisma/client";

export class CreateBillingDto {
  name: string;
  amount: number;
  type: BillingType;
  category: BillingCategory;
  time: string;
}
