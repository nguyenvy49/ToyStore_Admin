"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import InputForm from "../form-elements/InputForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { EditFormProps } from "@/types/props";
import { useEffect, useRef } from "react";
import { renderData } from "@/hooks/usePrefill";
import { SupplierService } from "@/services/supplierService";

type InfoSupplier = {
    SupplierName: string;
    Phone: string;
    Email: string;
    Address: string;
    Note: string | null | undefined;
};

export default function EditForm({ id }: EditFormProps) {
    const { values, setValue, setErrors } = useFormContext();
    const { openNotification } = useNotification();
    const openNotificationRef = useRef(openNotification);
    const setValueRef = useRef(setValue);
    const router = useRouter();
    const fetchDataSupplier = async (id: string) => {
        // Lấy thông tininfoPromotion khuyến mãi
        const res = await SupplierService.infoSupplier(id);
        console.log(res);
        if (res.success) {
            const infoSupplier: InfoSupplier = {
                SupplierName: res.result.supplierName,
                Phone: res.result.phone,
                Email: res.result.email,
                Address: res.result.address,
                Note: res.result.note,
            };
            renderData(infoSupplier, setValueRef.current);
        } else {
            openNotificationRef.current({
                message: "Lỗi",
                description: "Không lấy được thông tin nhà cung cấp",
                placement: "top",
                duration: 3,
                icon: <FaRegSmileBeam style={{ color: "red" }} />,
                style: { borderLeft: "5px solid red" },
            });
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {             
                await fetchDataSupplier(id)
            } catch (error) {
                openNotificationRef.current({
                    message: "Lỗi",
                    description: "Có lỗi xảy ra: " + error,
                    placement: "top",
                    duration: 3,
                    icon: <FaRegSmileBeam style={{ color: "red" }} />,
                    style: { borderLeft: "5px solid red" },
                });
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (data: Record<string, any> | FormData) => {
        const newErrors: { name: string; message: string }[] = [];

        // validate các trường
        if (!values.SupplierName) newErrors.push({ name: "SupplierName", message: "Tên không được để trống" });
        if (!values.Phone) newErrors.push({ name: "Phone", message: "Số điện thoại không được để trống" });
        if (!values.Email) newErrors.push({ name: "Email", message: "Email không được để trống" });
        if (!values.Address) newErrors.push({ name: "Address", message: "Địa chỉ không được để trống" });

        setErrors(newErrors);

        if (newErrors.length === 0) {
              const res = await SupplierService.updateSupplier(id, data)
              if (res.success){
                openNotification({
                  message: "Sửa nhà cung cấp thành công",
                  description: "Nhà cung cấp đã được sửa vào hệ thống.",
                  placement: "top",
                  duration: 3,
                  icon: <FaRegSmileBeam style={{ color: "green" }} />,
                  style: { borderLeft: "5px solid green" },
                })
                router.push("/suppliers");
                router.refresh();
              }else{
                openNotification({
                  message: "Sửa knhà cung cấp lỗi",
                  description: "Nhà cung cấp không được sửa vào hệ thống",
                  placement: "top",
                  duration: 3,
                  icon: <FaRegSmileBeam style={{ color: "red" }} />,
                  style: { borderLeft: "5px solid red" },
                })
              }
            } else {
              console.log("❌ Errors:", newErrors);
            }
    };

    return (
        <Form onSubmit={handleSubmit} mode="multipart" method="POST">
            <InputForm label="Tên nhà cung cấp" name="SupplierName" placeholder="Nhập tên nhà cung cấp" />
            <InputForm label="Số điện thoại" name="Phone" placeholder="Nhập số điện thoại" />
            <InputForm label="Email" name="Email" placeholder="Nhập email" />
            <InputForm label="Địa chỉ" name="Address" placeholder="Nhập địa chỉ" />
            <InputForm label="Ghi chú" name="Note" placeholder="Nhập ghi chú" />
            <div className="flex justify-center">
                <Button type="submit" variant="primary" className="mt-4" size="md">
                    Sửa Nhà Cung Cấp
                </Button>
            </div>
        </Form>
    );
}
