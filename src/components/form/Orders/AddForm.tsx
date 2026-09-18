"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import InputForm from "../form-elements/InputForm";
import TextAreaForm from "../form-elements/TextAreaForm";
import ImageInputForm from "../form-elements/ImageInputForm";
import DatePickerForm from "../form-elements/DatePickerForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";

export default function AddForm() {
  const { values, setErrors} = useFormContext();
  const { openNotification } = useNotification();

  const handleSubmit = (data: Record<string, any> | FormData) => {
    const newErrors: { name: string; message: string }[] = [];

    // validate text fields
    if (!values.title) newErrors.push({ name: "title", message: "Tiêu đề không được để trống" });
    if (!values.content) newErrors.push({ name: "content", message: "Nội dung không được để trống" });
    if (!values.image) newErrors.push({ name: "image", message: "Vui lòng chọn ảnh" });
    if (!values.publishDate) newErrors.push({ name: "publishDate", message: "Vui lòng chọn ngày đăng" });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      if (data instanceof FormData) {
        // multipart submit
        console.log("🚀 Multipart FormData submit:");
        for (const [key, value] of data.entries()) {
          console.log(key, value);
        }
        console.log("Categories:", data); // nếu là multi select
      } else {
        // json submit
        console.log("🚀 JSON submit:", data);
      }
      openNotification({
          message: "Custom Notification",
          description: "Nội dung chi tiết thông báo",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "green" }} />,
          style: { borderLeft: "5px solid green" },
        })
    } else {
      console.log("❌ Errors:", newErrors);
    }
  };

  return (
    <Form onSubmit={handleSubmit} mode="multipart">
      <InputForm label="Tiêu đề" name="title" placeholder="Nhập tiêu đề" />
      <ImageInputForm label="Hình ảnh" name="image" />
      <TextAreaForm label="Nội dung" name="content" placeholder="Nhập nội dung" />
      <DatePickerForm
        id="publishDate"
        name="publishDate"
        label="Ngày đăng"
        placeholder="Chọn ngày đăng"
        mode="single"
        required
      />
      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="mt-4" size="md">
          Thêm đơn hàng
        </Button>
      </div>
    </Form>
  );
}
