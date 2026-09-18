"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { PermissionType, UserPermissionsType } from "@/schemaValidations/permission.schema";
import { PermissionService } from "@/services/permissionService";

interface UserPermissionContextType {
  userPermissions: UserPermissionsType | null;
  loadingUserPermissions: boolean;
  refreshPermissions: () => Promise<void>;
}

const UserPermissionContext = createContext<UserPermissionContextType | undefined>(undefined);

export const UserPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState<UserPermissionsType | null>(null);
  const [loadingUserPermissions, setLoadingUserPermissions] = useState(true);

  const fetchPermissions = async () => {
    try {
      setLoadingUserPermissions(true);
      const res: UserPermissionsType = await PermissionService.getPermissionUser(); // API trả về { userId, userName, permissions: [...] }
      console.log("Fetched user permissions:", res);
      // Lọc trùng permission nếu cần
      const uniquePermissions = (list: PermissionType[]) => {
        const map = new Map<string, PermissionType>();
        list.forEach(item => map.set(item.id, item));
        return Array.from(map.values());
      };

      setUserPermissions({
        ...res,
        permissions: uniquePermissions(res.permissions),
      });
    } catch (error) {
      console.error("Lỗi khi lấy quyền:", error);
    } finally {
      setLoadingUserPermissions(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <UserPermissionContext.Provider value={{ userPermissions, loadingUserPermissions, refreshPermissions: fetchPermissions }}>
      {children}
    </UserPermissionContext.Provider>
  );
};

// Hook dùng trong component
export const useUserPermission = () => {
  const context = useContext(UserPermissionContext);
  if (!context) {
    throw new Error("useUserPermission phải được sử dụng trong UserPermissionProvider");
  }
  return context;
};
