"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import InputForm from "../form-elements/InputForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { SupplierService } from "@/services/supplierService";

export default function AddSupplierForm() {
  const { values, setErrors } = useFormContext();
  const { openNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (data: Record<string, any>) => {
    const newErrors: { name: string; message: string }[] = [];

    // ✅ validate input theo data (không dùng values nữa)
    if (!values.SupplierName) newErrors.push({ name: "name", message: "Tên nhà cung cấp không được để trống" });
    if (!values.Phone) newErrors.push({ name: "phone", message: "Số điện thoại không được để trống" });
    if (!values.Email) newErrors.push({ name: "email", message: "Email không được để trống" });
    if (!values.Address) newErrors.push({ name: "address", message: "Địa chỉ không được để trống" });
    if (!values.Note) newErrors.push({ name: "note", message: "Ghi chú không được để trống" });


    setErrors(newErrors);

    if (newErrors.length > 0) {
      console.log("❌ Errors:", newErrors);
      return;
    }

    try {
      const res = await SupplierService.createSupplier(data);

      if (res?.success) {
        openNotification({
          message: "Thêm nhà cung cấp thành công",
          description: "Nhà cung cấp đã được thêm vào hệ thống.",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "green" }} />,
          style: { borderLeft: "5px solid green" },
        });
        router.push("/suppliers");
        router.refresh();
      } else {
        openNotification({
          message: "Thêm nhà cung cấp lỗi",
          description: "Không thể thêm nhà cung cấp vào hệ thống.",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "red" }} />,
          style: { borderLeft: "5px solid red" },
        });
      }
    } catch (error: any) {
      openNotification({
        message: "Thêm nhà cung cấp lỗi",
        description: "Xảy ra lỗi: " + (error.message || error),
        placement: "top",
        duration: 3,
        icon: <FaRegSmileBeam style={{ color: "red" }} />,
        style: { borderLeft: "5px solid red" },
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit} mode="multipart" method="POST">
      <InputForm label="Tên nhà cung cấp" name="SupplierName" placeholder="Nhập tên nhà cung cấp" />
      <InputForm label="Số điện thoại" name="Phone" placeholder="Nhập số điện thoại" />
      <InputForm label="Email" name="Email" placeholder="Nhập email" />
      <InputForm label="Địa chỉ" name="Address" placeholder="Nhập địa chỉ" />
      <InputForm label="Ghi chú" name="Note" placeholder="Nhập ghi chú (không bắt buộc)" />
      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="mt-4" size="md">
          Thêm Nhà Cung Cấp
        </Button>
      </div>
    </Form>
  );
}
