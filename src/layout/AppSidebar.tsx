"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { FaRegNewspaper } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { AiOutlineProduct, AiOutlineHome } from "react-icons/ai";
import { RiDiscountPercentLine, RiBillLine } from "react-icons/ri";
import { GrDeliver } from "react-icons/gr";
import { LiaWarehouseSolid } from "react-icons/lia";
import { MdOutlineCategory, MdLogout, MdKeyboardArrowDown, MdOutlineMenu } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavItem } from "@/types/context";
import { AuthService } from "@/services/authService";
import { useUserPermission } from "@/context/UserPermissionContext";

const navItems: NavItem[] = [
  { icon: <AiOutlineHome size={20} />, name: "Trang chủ", path: "/" },
  { icon: <BsPeople size={20} />, name: "Quản lý khách hàng", path: "/customers" },
  { icon: <GrDeliver size={20} />, name: "Quản lý nhà cung cấp", path: "/suppliers" },
  { icon: <LiaWarehouseSolid size={20} />, name: "Quản lý kho hàng", path: "/warehouses" },
  { icon: <MdOutlineCategory size={20} />, name: "Quản lý danh mục", path: "/categories" },
  { icon: <AiOutlineProduct size={20} />, name: "Quản lý sản phẩm", path: "/products" },
  { icon: <RiBillLine size={20} />, name: "Quản lý đơn hàng", path: "/orders" },
  { icon: <FaRegNewspaper size={20} />, name: "Quản lý tin tức", path: "/news" },
  { icon: <RiDiscountPercentLine size={20} />, name: "Quản lý khuyến mãi", path: "/promotions" },
  {
    icon: <CgProfile size={20} />,
    name: "Quản lý nhân viên",
    subItems: [
      { name: "Danh sách nhân viên", path: "/employees", pro: false },
      { name: "Phân quyền", path: "/employees/authorization", pro: false }
    ],
  },
];

const othersItems: NavItem[] = [
  { icon: <MdLogout />, name: "Đăng xuất", action: "sign-out" },
];

// mapping navItem path -> required permission code
const navPermissionMap: Record<string, string[]> = {
  "/categories": ["CATEGORY_VIEW"],
  "/products": ["PRODUCT_VIEW"],
  "/orders": ["ORDER_VIEW"],
  "/news": ["NEWS_VIEW"],
  "/promotions": ["PROMOTION_VIEW"],
  "/suppliers": ["SUPPLIER_VIEW"],
  "/warehouses": ["WAREHOUSE_VIEW"],
  "/employees": ["STAFF_VIEW"],
  "/employees/authorization": ["PERMISSION_VIEW"],
  "/customers": ["USER_VIEW"],
};

const filterNavItemsByPermissions = (navItems: NavItem[], permissions: string[]): NavItem[] => {
  return navItems
    .map(item => {
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(sub => {
          const required = navPermissionMap[sub.path] || [];
          return required.every(p => permissions.includes(p));
        });
        if (filteredSubItems.length === 0) return null; // bỏ item nếu không còn subItems
        return { ...item, subItems: filteredSubItems };
      } else {
        const required = item.path ? navPermissionMap[item.path] || [] : [];
        if (!required.every(p => permissions.includes(p))) return null;
        return item;
      }
    })
    .filter(Boolean) as NavItem[];
};

interface Props {
  setHandling: (value: boolean) => void;
  handling: boolean;
}

const AppSidebar: React.FC<Props> = ({ setHandling, handling }) => {
  const router = useRouter();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { userPermissions } = useUserPermission();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleLogout = async () => {
    if (handling) return;
    setHandling(true);
    try {
      const success = await AuthService.logout();
      if (success) router.push("/signin");
      else setHandling(false);
    } catch (error) {
      console.error(error);
      setHandling(false);
    }
  };

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu(prev => (prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }));
  };

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight(prev => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu]);

  // Lọc menu dựa trên quyền
  const permissionCodes = userPermissions?.permissions
    .filter(p => p.isGranted)   // nếu bạn muốn chỉ lấy quyền được cấp
    .map(p => p.code) || [];

  const filteredNavItems = filterNavItemsByPermissions(navItems, permissionCodes);

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span className={openSubmenu?.type === menuType && openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                {(isExpanded || isHovered || isMobileOpen) && <MdKeyboardArrowDown className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />}
              </button>
              {(isExpanded || isHovered || isMobileOpen) && (
                <div ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }} className="overflow-hidden transition-all duration-300" style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}>
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map(sub => (
                      <li key={sub.name}>
                        <Link href={sub.path} className={`menu-dropdown-item ${isActive(sub.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : nav.path ? (
            <Link href={nav.path} className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}>
              <span className={isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
            </Link>
          ) : nav.action === "sign-out" ? (
            <button onClick={handleLogout} className="menu-item group menu-item-inactive">
              <span className="menu-item-icon-inactive">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logo7.png" alt="Logo" width={150} height={40} />
              <Image className="hidden dark:block" src="/images/logo/logo7.png" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <MdOutlineMenu />}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                {isExpanded || isHovered || isMobileOpen ? "Others" : <MdOutlineMenu />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
