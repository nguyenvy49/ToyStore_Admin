import { get } from "@/utils/request";

export interface SepayQrData {
  orderId: string;
  transactionCode: string;
  amount: number;
  bank?: string;
  bankCode?: string;
  accountNumber: string;
  accountName: string;
  qrUrl?: string;
  qrCodeUrl?: string;
  content?: string;
  description?: string;
  isPaid?: boolean;
  paymentStatus?: string;
}

export interface PaymentStatusData {
  orderId: string;
  paymentStatus: number;
  orderStatus: number;
  isPaid: boolean;
}

export const PaymentService = {
  getSepayQr: (orderId: string) =>
    get<any>(`/api/Payment/sepay-qr/${orderId}`, { requireAuth: false }),

  checkPaymentStatus: (orderId: string) =>
    get<any>(`/api/Payment/check-status/${orderId}`, { requireAuth: false }),
};
