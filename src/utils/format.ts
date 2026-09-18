import { PermissionListType, PermissionType } from "@/schemaValidations/permission.schema";

export function formatDateTime(
  isoString: string,
  locale: string = "vi-VN",
  timeZone: string = "Asia/Ho_Chi_Minh"
): string {
  const date = new Date(isoString);

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // dùng giờ 24h
    timeZone: timeZone,
  });
}

export function formatCurrency(amount: number, locale: string = "vi-VN"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, // không hiện số lẻ
    maximumFractionDigits: 0
  }).format(amount);
}

//Viết hoa chứ cái đầu
export function capitalizeFirstLetter(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//Viết thường chữ cái đầu
export function uncapitalizeFirstLetter(str: string) {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function getFirstImageFromString(image?: string | null): string | null {
  if (!image) return null; // xử lý undefined hoặc null

  try {
    const parsed = JSON.parse(image);

    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
      return parsed[0];
    }

    return null;
  } catch (error) {
    console.error("Invalid JSON in image:", error);
    return null;
  }
}

export function groupPermissions(permissions: PermissionType[]): PermissionListType[] {
  const moduleNameMap: Record<string, string> = {
    category: 'danh mục',
    news: 'tin tức',
    order: 'đơn hàng',
    product: 'sản phẩm',
    promotion: 'khuyến mãi',
    role: 'vai trò',
    staff: 'nhân viên',
    supplier: 'nhà cung cấp',
    user: 'người dùng',
    warehouse: 'kho hàng',
    permission: 'quyền'
  };

  const grouped = permissions.reduce<Record<string, { key: string; name: string; role: PermissionType[] }>>(
    (acc, perm) => {
      const [module, action] = perm.code.split('_');
      if (!module || !action) return acc;

      const moduleKey = module.toLowerCase();

      if (!acc[moduleKey]) {
        acc[moduleKey] = {
          key: moduleKey,
          name: `Quản lý ${moduleNameMap[moduleKey] || moduleKey}`,
          role: []
        };
      }

      acc[moduleKey].role.push(perm);

      return acc;
    },
    {}
  );

  return Object.values(grouped).map((item, index): PermissionListType => ({
    id: index + 1,
    name: item.name,
    role: item.role
  }));
}