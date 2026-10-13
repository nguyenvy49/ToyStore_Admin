import envConfig from "@/config/envConfig";
import { get } from "@/utils/request";

export interface GhnWebhookPayload {
  ShopID: number;
  Time: string;
  OrderCode: string;
  ClientOrderCode?: string;
  Type: string;
  Description: string;
  Status: string;
  Reason?: string;
  ReasonCode?: string;
  CODAmount: number;
  TotalFee?: number;
  Warehouse?: string;
  ShipperName?: string;
  ShipperPhone?: string;
  PodURL?: string;
  CheckSum?: string;
}

export interface GhnWebhookResponse {
  RspCode: string;
  Message: string;
}

export const GhnFrontendService = {
  /**
   * Bắn webhook mô phỏng từ GHN Internal Portal về Backend ToyStore
   */
  async sendWebhook(payload: GhnWebhookPayload): Promise<{ success: boolean; data?: GhnWebhookResponse; error?: string; status: number }> {
    const baseUrl = envConfig.NEXT_PUBLIC_API_URL || "http://localhost:5073";
    const endpoint = `${baseUrl.replace(/\/$/, "")}/api/Ghn/webhook`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        return {
          success: true,
          data: data as GhnWebhookResponse,
          status: response.status,
        };
      } else {
        return {
          success: false,
          error: data?.message || `HTTP ${response.status}: Lỗi máy chủ`,
          status: response.status,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Không thể kết nối đến máy chủ Backend",
        status: 0,
      };
    }
  },

  /**
   * Tính phí giao hàng từ GHN
   */
  async calculateFee(toDistrictId: number, toWardCode: string, weight = 500) {
    const baseUrl = envConfig.NEXT_PUBLIC_API_URL || "http://localhost:5073";
    const endpoint = `${baseUrl.replace(/\/$/, "")}/api/Ghn/fee`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toDistrictId, toWardCode, weight }),
    });
    return res.json();
  },
};
