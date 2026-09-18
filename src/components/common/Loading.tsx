import React from "react";

interface LoadingProps {
  colSpan?: number;
}

export const Loading: React.FC<LoadingProps> = ({ colSpan }) => {
  const content = (
    <div className="flex items-center justify-center space-x-2 py-6 text-gray-500">
      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span>Đang tải dữ liệu...</span>
    </div>
  );

  if (colSpan) {
    // Khi dùng trong bảng
    return (
      <tbody>
        <tr>
          <td colSpan={colSpan} className="px-4 text-center">
            {content}
          </td>
        </tr>
      </tbody>
    );
  }

  // Khi dùng trong div bình thường
  return <div className="w-full text-center">{content}</div>;
};
