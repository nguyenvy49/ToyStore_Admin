"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import { renderData } from "@/hooks/usePrefill";
import InputForm from "../form-elements/InputForm";
import TextAreaForm from "../form-elements/TextAreaForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";
import SelectForm from "../form-elements/SelectForm";
import DatePickerForm from "../form-elements/DatePickerForm";
import { useEffect, useRef, useState } from "react";
import { PromotionService } from "@/services/promotionService";
import { ProductService } from "@/services/productService";
import { useRouter } from "next/navigation";
import { EditFormProps } from "@/types/props";

type Option = {
  value: string;
  label: string;
};

type InfoPromotion ={
  Title: string;
  Description: string;
  DiscountPercent: number;
  StartDate: string;
  EndDate: string;
  ProductIds: string[];
}


export default function EditForm({ id }: EditFormProps) {
  const { values, setErrors,setValue } = useFormContext();
  const { openNotification } = useNotification();
  const openNotificationRef = useRef(openNotification);
  const setValueRef = useRef(setValue);
  const [optionSelect, setOptionSelect] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fetchDataProducts = async () => {
    // Lấy danh sách sản phẩm
      const resOption = await ProductService.getListProduct("/api/Product/admin");
      const options: Option[] = resOption.result.items.map((item: any) => ({
        value: item.id,
        label: item.productName,
      }));
      setOptionSelect(options);
  }
  const fetchDataPromotion = async (id: string) => {
    // Lấy thông tininfoPromotion khuyến mãi
      const res = await PromotionService.infoPromotion(id);
      if (res.success) {
        const infoPromotion: InfoPromotion = {
          Title: res.result.title,
          Description: res.result.description,
          DiscountPercent: res.result.discountPercent,
          StartDate: res.result.startDate,
          EndDate: res.result.endDate,
          ProductIds: res.result.products?.map((item: any) => item.id) || [],
        };
        renderData(infoPromotion, setValueRef.current);
      } else {
        openNotificationRef.current({
          message: "Lỗi",
          description: "Không lấy được thông tin khuyến mãi",
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
        await fetchDataProducts()
        await fetchDataPromotion(id)
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
    // validate text fields
    if (!values.Title) newErrors.push({ name: "Title", message: "Tiêu đề không được để trống" });
    if (!values.StartDate) newErrors.push({ name: "StartDate", message: "Ngày bắt đầu không được để trống" });
    if (!values.EndDate) newErrors.push({ name: "EndDate", message: "Ngày kết thúc không được để trống" });
    if (!values.ProductIds) newErrors.push({ name: "ProductIds", message: "Sản phẩm không được để trống" });
    if (!values.DiscountPercent) newErrors.push({ name: "DiscountPercent", message: "Phần trăm không được để trống" });
    setErrors(newErrors);

    if (newErrors.length === 0) {
      setIsLoading(true);
      const res = await PromotionService.updatePromotion(id, data)
      if (res.success){
        openNotification({
          message: "Sửa khuyến mãi thành công",
          description: "Khuyến mãi đã được sửa vào hệ thống.",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "green" }} />,
          style: { borderLeft: "5px solid green" },
        })
        router.push("/promotions");
        router.refresh();
      }else{
        openNotification({
          message: "Sửa khuyến mãi lỗi",
          description: "Khuyến mãi không được sửa vào hệ thống",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "red" }} />,
          style: { borderLeft: "5px solid red" },
        })
        setIsLoading(false);
      }
    } else {
      console.log("❌ Errors:", newErrors);
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} mode="multipart" method="POST">
      <InputForm label="Tiêu đề" name="Title" placeholder="Nhập tiêu đề" />
        <TextAreaForm label="Mô tả" name="Description" placeholder="Nhập nội dung" />
        <InputForm label="% giảm giá" name="DiscountPercent" placeholder="Nhập % giảm giá" type="number" />
        <DatePickerForm
          id="StartDate"
          name="StartDate"
          label="Ngày bắt đầu"
          placeholder="Chọn ngày bắt đầu"
          mode="single"
          required
        />
        <DatePickerForm
          id="EndDate"
          name="EndDate"
          label="Ngày kết thúc"
          placeholder="Chọn ngày kết thúc"
          mode="single"
          required
        />
        <SelectForm
          name="ProductIds"
          label="Sản phẩm áp dụng khuyến mãi"
          mode="multiple"
          placeholder="Chọn sản phẩm áp dụng khuyến mãi"
          options={optionSelect}
        />
      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="mt-4" size="md" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Đang sửa...
            </>
          ) : (
            "Sửa khuyến mãi"
          )}
        </Button>
      </div>
    </Form>
  );
}
