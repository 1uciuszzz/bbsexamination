import { Module } from "@nestjs/common";
import { BillingController } from "./billing.controller";
import { PrismaService } from "src/shared/prisma.service";
import { BillingService } from "./billing.service";

@Module({
  controllers: [BillingController],
  providers: [PrismaService, BillingService],
})
export class BillingModule {}
