export interface GhnStatusInfo {
  label: string;
  badgeClass: string;
  color: "warning" | "info" | "primary" | "success" | "error" | "light" | "dark";
}

export const ghnStatusMap: Record<string, GhnStatusInfo> = {
  ready_to_pick: { label: "Sẵn sàng lấy hàng", badgeClass: "bg-yellow-100 text-yellow-800 border border-yellow-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "warning" },
  picking: { label: "Đang lấy hàng", badgeClass: "bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "info" },
  money_collect_picking: { label: "Đang thu tiền người gửi", badgeClass: "bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "info" },
  picked: { label: "Đã lấy hàng", badgeClass: "bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "info" },
  storing: { label: "Hàng đang ở kho", badgeClass: "bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "primary" },
  transporting: { label: "Đang luân chuyển", badgeClass: "bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "primary" },
  sorting: { label: "Đang phân loại", badgeClass: "bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "primary" },
  delivering: { label: "Đang giao hàng", badgeClass: "bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "primary" },
  money_collect_delivering: { label: "Đang giao & Thu tiền COD", badgeClass: "bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "primary" },
  delivered: { label: "Đã giao hàng thành công", badgeClass: "bg-green-100 text-green-800 border border-green-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "success" },
  delivery_fail: { label: "Giao hàng thất bại", badgeClass: "bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "error" },
  waiting_to_return: { label: "Chờ trả hàng", badgeClass: "bg-orange-100 text-orange-800 border border-orange-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "warning" },
  return: { label: "Trả hàng", badgeClass: "bg-orange-100 text-orange-800 border border-orange-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "warning" },
  return_transporting: { label: "Đang luân chuyển trả hàng", badgeClass: "bg-orange-100 text-orange-800 border border-orange-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "warning" },
  return_sorting: { label: "Đang phân loại trả hàng", badgeClass: "bg-orange-100 text-orange-800 border border-orange-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "warning" },
  returning: { label: "Đang trả hàng", badgeClass: "bg-orange-100 text-orange-800 border border-orange-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "warning" },
  return_fail: { label: "Trả hàng thất bại", badgeClass: "bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "error" },
  returned: { label: "Đã trả hàng", badgeClass: "bg-gray-100 text-gray-800 border border-gray-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "error" },
  exception: { label: "Hàng ngoại lệ / Sự cố", badgeClass: "bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "error" },
  damage: { label: "Hàng hư hỏng", badgeClass: "bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "error" },
  lost: { label: "Hàng thất lạc", badgeClass: "bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "error" },
  cancel: { label: "Đã hủy đơn hàng", badgeClass: "bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold", color: "error" },
};

const defaultStatuses = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

export function getOrderStatusText(orderStatus: number, ghnStatus?: string | null): string {
  if (ghnStatus && ghnStatusMap[ghnStatus.toLowerCase()]) {
    return ghnStatusMap[ghnStatus.toLowerCase()].label;
  }
  return defaultStatuses[orderStatus] || "Chưa xác định";
}

export function getOrderStatusBadgeClass(orderStatus: number, ghnStatus?: string | null): string {
  if (ghnStatus && ghnStatusMap[ghnStatus.toLowerCase()]) {
    return ghnStatusMap[ghnStatus.toLowerCase()].badgeClass;
  }
  const defaultClasses = [
    "bg-yellow-100 text-yellow-800 border border-yellow-300 px-2.5 py-0.5 rounded-full text-xs font-semibold",
    "bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-semibold",
    "bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full text-xs font-semibold",
    "bg-green-100 text-green-800 border border-green-300 px-2.5 py-0.5 rounded-full text-xs font-semibold",
    "bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full text-xs font-semibold",
  ];
  return defaultClasses[orderStatus] || "bg-gray-100 text-gray-800 border border-gray-300 px-2.5 py-0.5 rounded-full text-xs font-semibold";
}
