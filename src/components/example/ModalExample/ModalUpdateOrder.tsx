"use client";
import Form from "@/components/form/Form";
import SelectForm from "@/components/form/form-elements/SelectForm";
import Button from "@/components/ui/button/Button";
import { useNotification } from "@/context/NotificationContext";
import { usePrefill } from "@/hooks/usePrefill";
import { OrderService } from "@/services/orderService";
import React, { useState } from "react";

type ModalUpdateOrderProps = {
    id: string;
    status: number | null;
    title: string;
    description?: string;
    closeModal: () => void;
    loadData?: (urlApi: string) => void;
    urlApi?: string;
};

export default function ModalUpdateOrder({
    id,
    status,
    title,
    description,
    loadData,
    closeModal,
    urlApi,
}: ModalUpdateOrderProps) {
    const { openNotification } = useNotification();
    const [loading, setLoading] = useState(false);

    usePrefill({
        orderStatus: status,
    });
    const handleUpdate = async (data: Record<string, any>) => {
        try {
            setLoading(true);
            const res = await OrderService.updateOrder(id, data);
            console.log(res);
            if (res.success) {
                if (loadData && urlApi) loadData(urlApi);
                closeModal();
                openNotification({
                    message: `${title} ${description} thành công`,
                    description: `${description} đã được cập nhật.`,
                    placement: "top",
                    duration: 3,
                    style: { borderLeft: "5px solid green" },
                });
            } else {
                closeModal();
                openNotification({
                    message: `${title} thất bại`,
                    description: `${description} không được cập nhật.`,
                    placement: "top",
                    duration: 3,
                    style: { borderLeft: "5px solid red" },
                });
            }
        }
        catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            closeModal();
            openNotification({
                message: `${title} thất bại`,
                description: `${description} không được cập nhật.`,
                placement: "top",
                duration: 3,
                style: { borderLeft: "5px solid red" },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 mt-6 bg-white shadow-lg rounded-2xl">
            <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                {title} {description}
            </h4>

            <p className="mb-4 text-sm text-gray-800 dark:text-gray-200">
                Vui lòng chọn thông tin cần cập nhật cho{" "}
                <strong className="text-red-600">{description}</strong>.
            </p>

            {/* Select box */}
            <Form onSubmit={handleUpdate} className="space-y-4" method="POST">
                <div className="mb-6">
                    <SelectForm
                        placeholder="Chọn trạng thái"
                        isModel={true}
                        name="orderStatus"
                        label="Trạng thái"
                        options={[
                            { label: "Chờ xác nhận", value: 0 },
                            { label: "Đã xác nhận", value: 1 },
                            { label: "Đang giao", value: 2 },
                            { label: "Hoàn thành", value: 3 },
                            { label: "Đã hủy", value: 4 },
                        ]}
                        size="lg"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        //   onClick={handleUpdate}
                        disabled={loading}
                        size="sm"
                        variant="warning"
                        type="submit"
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
