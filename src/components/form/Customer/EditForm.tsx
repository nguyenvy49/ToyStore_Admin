"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import InputForm from "../form-elements/InputForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";

import { usePrefill } from "@/hooks/usePrefill";
import SwitchForm from "../form-elements/SwitchForm";


export default function EditForm() {
    const { values, setErrors } = useFormContext();
    const { openNotification } = useNotification();

    usePrefill({
        name: "Tên Sản Phẩm",
        images: ["https://tse1.mm.bing.net/th/id/OIP.CFG1RgZ9gTRtNgk_wWxG8QHaEO?rs=1&pid=ImgDetMain&o=7&rm=3"],
        category: ["1"],
        brand: ["1"],
        price: 100000,
        description: "Mô tả sản phẩm",
    });

    const handleSubmit = (data: Record<string, any> | FormData) => {
        const newErrors: { name: string; message: string }[] = [];

        // validate text fields
        if (!values.name) newErrors.push({ name: "name", message: "Tiêu đề không được để trống" });
        if (!values.description) newErrors.push({ name: "description", message: "Nội dung không được để trống" });
        if (!values.images) newErrors.push({ name: "images", message: "Vui lòng chọn ảnh" });

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
            <InputForm label="Tên khách hàng" name="name" placeholder="Nhập tên nhà cung cấp" />
            <InputForm label="Số điện thoại" name="phone" placeholder="Nhập số điện thoại" />
            <InputForm label="Email" name="email" placeholder="Nhập email" />
            <InputForm label="Địa chỉ" name="address" placeholder="Nhập địa chỉ" />
            <InputForm label="Ghi chú" name="note" placeholder="Nhập ghi chú" />
            <SwitchForm
                    name="switch1"
                    defaultChecked={true}
                    onLabel="Đang hoạt động"
                    offLabel="Ngừng hoạt động"
                    label="Trạng thái"
                    size="lg"
                />
            <div className="flex justify-center">
                <Button type="submit" variant="primary" className="mt-4" size="md">
                    Sửa Khách Hàng
                </Button>
            </div>
        </Form>
    );
}
