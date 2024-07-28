import { Injectable } from "@nestjs/common";
import { BillingCategory, BillingType } from "@prisma/client";
import { PrismaService } from "src/shared/prisma.service";

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  create = async (
    accountId: string,
    name: string,
    amount: number,
    type: BillingType,
    category: BillingCategory,
    time: string,
  ) => {
    const billing = await this.prisma.billing.create({
      data: {
        accountId,
        name,
        amount,
        type,
        category,
        time,
      },
    });
    return billing;
  };

  delete = async (accountId: string, id: string) => {
    const billing = await this.prisma.billing.delete({
      where: {
        accountId,
        id,
      },
    });
    return billing;
  };

  update = async (
    accountId: string,
    id: string,
    name: string,
    amount: number,
    type: BillingType,
    category: BillingCategory,
    time: string,
  ) => {
    const billing = await this.prisma.billing.update({
      where: {
        accountId,
        id,
      },
      data: {
        name,
        amount,
        type,
        category,
        time,
      },
    });
    return billing;
  };

  get = async (accountId: string, id: string) => {
    const billing = await this.prisma.billing.findUnique({
      where: {
        accountId,
        id,
      },
    });
    return billing;
  };

  getByTimeRange = async (accountId: string, start: string, end: string) => {
    const billings = await this.prisma.billing.findMany({
      orderBy: {
        time: "desc",
      },
      where: {
        accountId,
        time: {
          gte: start,
          lte: end,
        },
      },
    });
    return billings;
  };

  getIncomeByRange = async (accountId: string, start: string, end: string) => {
    const res = await this.prisma.billing.aggregate({
      where: {
        accountId,
        type: BillingType.INCOME,
        time: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return res._sum.amount || 0;
  };

  getExpenseByRange = async (accountId: string, start: string, end: string) => {
    const res = await this.prisma.billing.aggregate({
      where: {
        accountId,
        type: BillingType.EXPENSE,
        time: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return res._sum.amount || 0;
  };
}
