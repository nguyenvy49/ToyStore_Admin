import React from "react";

interface NoDataProps {
  colSpan?: number;
  title: string;
}

export const NoData: React.FC<NoDataProps> = ({ colSpan, title }) => {
  const content = (
    <div className="py-3 text-gray-500 text-center text-theme-lg">
      {title}
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

  // Khi dùng ngoài bảng (div)
  return <div className="w-full text-center">{content}</div>;
};
