"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import InputForm from "../form-elements/InputForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";
import SwitchForm from "../form-elements/SwitchForm";
import { PermissionService } from "@/services/permissionService";

export default function AddForm() {
  const { values, setErrors } = useFormContext();
  const { openNotification } = useNotification();

  const handleSubmit = async (data: Record<string, any>) => {
    const newErrors: { name: string; message: string }[] = [];

    // validate text fields
    if (!values.fullName) newErrors.push({ name: "fullName", message: "Tiêu đề không được để trống" });
    if (!values.phoneNumber) newErrors.push({ name: "phoneNumber", message: "Số điện thoại không được để trống" });
    if (!values.email) newErrors.push({ name: "email", message: "Email không được để trống" });
    if (!values.address) newErrors.push({ name: "address", message: "Địa chỉ không được để trống" });
    if (!values.password) newErrors.push({ name: "password", message: "Mật khẩu không được để trống" });
    if (values.password !== values.confirmPassword)
      newErrors.push({ name: "confirmPassword", message: "Mật khẩu xác nhận không khớp" });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      try {
        data.gender = data.gender ? 0 : 1;
        console.log("✅ Submitted data:", data);
        const res = await PermissionService.createUser(data);
        console.log("Response:", res);
        if (res.success) {
          openNotification({
            message: "Thành công",
            description: "Tạo tài khoản nhân viên thành công!",
            placement: "top",
            duration: 3,
            icon: <FaRegSmileBeam style={{ color: "green" }} />,
            style: { borderLeft: "5px solid green" },
          })
        } else {
          openNotification({
            message: "Thất bại",
            description: "Tạo tài khoản nhân viên thất bại!",
            placement: "top",
            duration: 3,
            icon: <FaRegSmileBeam style={{ color: "red" }} />,
            style: { borderLeft: "5px solid red" },
          })
        }
      }
      catch (error) {
        openNotification({
          message: "Thất bại",
          description: "Tài khoản nhân viên đã tồn tại hoặc có lỗi xảy ra!",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "red" }} />,
          style: { borderLeft: "5px solid red" },
        })
        console.error("Error creating user:", error);
      }

    } else {
      console.log("❌ Errors:", newErrors);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputForm label="Tên nhân viên" name="fullName" placeholder="Nhập tên nhân viên" />
      <InputForm label="Số điện thoại" name="phoneNumber" placeholder="Nhập số điện thoại" />
      <InputForm label="Email" name="email" placeholder="Nhập email" type="email" />
      <InputForm label="Địa chỉ" name="address" placeholder="Nhập địa chỉ" type="text" />
      <div className="flex flex-nowrap gap-4 w-full items-center">
        <InputForm
          label="Mật khẩu"
          name="password"
          placeholder="Nhập mật khẩu"
          type="password"
          className="w-full"
        />
        <InputForm
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          type="password"
          className="w-full"
        />
        <SwitchForm
          name="gender"
          defaultChecked={true}
          size="xxs"
          onLabel="Nam"
          offLabel="Nữ"
          label="Giới tính"
        />
      </div>
      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="mt-4" size="md">
          Thêm nhân viên
        </Button>
      </div>
    </Form>
  );
}
