import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { BillingService } from "./billing.service";
import { User } from "src/auth/user.decorator";
import { TokenPayload } from "src/auth/dto/user.dto";
import { CreateBillingDto } from "./dto/create-billing.dto";
import dayjs from "dayjs";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Billing")
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  async create(@User() user: TokenPayload, @Body() payload: CreateBillingDto) {
    const billing = await this.billingService.create(
      user.id,
      payload.name,
      payload.amount,
      payload.type,
      payload.category,
      payload.time,
    );
    if (billing) {
      return billing;
    } else {
      throw new ForbiddenException();
    }
  }

  @Delete(":id")
  async delete(@User() user: TokenPayload, @Param("id") id: string) {
    const billing = await this.billingService.delete(user.id, id);
    if (billing) {
      return billing;
    } else {
      throw new NotFoundException();
    }
  }

  @Put(":id")
  async update(
    @User() user: TokenPayload,
    @Param("id") id: string,
    @Body() payload: CreateBillingDto,
  ) {
    const billing = await this.billingService.update(
      user.id,
      id,
      payload.name,
      payload.amount,
      payload.type,
      payload.category,
      payload.time,
    );
    if (!billing) {
      return billing;
    } else {
      throw new NotFoundException();
    }
  }

  @Get(":id")
  async get(@User() user: TokenPayload, @Param("id") id: string) {
    const billing = await this.billingService.get(user.id, id);
    if (billing) {
      return billing;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  async list(
    @User() user: TokenPayload,
    @Query("startTime") start: string | null,
    @Query("endTime") end: string | null,
  ) {
    const now = dayjs();
    const pastWeek = now.subtract(7, "d");
    start = start || pastWeek.toISOString();
    end = end || now.toISOString();
    const billings = await this.billingService.getByTimeRange(
      user.id,
      start,
      end,
    );
    const income = await this.billingService.getIncomeByRange(
      user.id,
      start,
      end,
    );
    const expense = await this.billingService.getExpenseByRange(
      user.id,
      start,
      end,
    );
    return { billings, income: income, expense: expense };
  }
}
