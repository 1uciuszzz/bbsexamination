import { Res, http } from "./http";

export enum BillingType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum BillingCategory {
  FOOD = "FOOD",
  SHOPPING = "SHOPPING",
  TRANSPORTATION = "TRANSPORTATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  HEALTH = "HEALTH",
  EDUCATION = "EDUCATION",
  OTHER = "OTHER",
}

export type Billing = {
  id: string;
  accountId: string;
  name: string;
  amount: number;
  type: BillingType;
  category: BillingCategory;
  time: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBillingReq = {
  name: string;
  amount: number;
  type: BillingType;
  category: BillingCategory;
  time: string;
};

export type UpdateBillingReq = CreateBillingReq;

export type ListReq = {
  startTime?: string;
  endTime?: string;
};

type ListRes = {
  billings: Billing[];
  income: number;
  expense: number;
};

export const API_BILLING = {
  CREATE: (payload: CreateBillingReq): Res<Billing> =>
    http.post(`/billing`, payload),
  DELETE: (id: string): Res<Billing> => http.delete(`/billing/${id}`),
  UPDATE: (id: string, payload: UpdateBillingReq): Res<Billing> =>
    http.put(`/billing/${id}`, payload),
  GET: (id: string): Res<Billing> => http.get(`/billing/${id}`),
  LIST: (payload: ListReq): Res<ListRes> =>
    http.get(`/billing`, { params: payload }),
};
