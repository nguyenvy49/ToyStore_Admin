"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import { renderData } from "@/hooks/usePrefill";
import InputForm from "../form-elements/InputForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";
import SelectForm from "../form-elements/SelectForm";
import ImageInputForm from "../form-elements/ImageInputForm";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryService } from "@/services/categoryService";
import { EditFormProps } from "@/types/props";

type Option = {
  value: string;
  label: string;
};
type InfoCategory ={
  Image: string | null;
  CategoryName: string;
  ParentId: string | null;
}

export default function EditForm({ id }: EditFormProps) {
  const { values, setErrors,setValue } = useFormContext();
  const { openNotification } = useNotification();
  const openNotificationRef = useRef(openNotification);
  const setValueRef = useRef(setValue);
  const [optionSelect, setOptionSelect] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchDataCategories = async () => {
      // Lấy danh sách sản phẩm
        const resOption = await CategoryService.getListCategory("/api/Category/Admin");
        const options: Option[] = resOption.result.items.map((item: any) => ({
          value: item.id,
          label: item.categoryName,
        }));
        setOptionSelect(options);
    }

  const fetchDataInfoCategories = async (id: string) => {
    // Lấy thông tininfoPromotion khuyến mãi
    const res = await CategoryService.infoCategory(id);
    console.log(res);
    if (res.success) {
      const infoCategory: InfoCategory = {
        Image: res.result.image,
        CategoryName: res.result.categoryName,
        ParentId: res.result.parentId,
      };
      renderData(infoCategory, setValueRef.current);
      console.log(infoCategory);
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
        await fetchDataCategories()
        await fetchDataInfoCategories(id)
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
    if (!values.CategoryName) newErrors.push({ name: "CategoryName", message: "Tiêu đề không được để trống" });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setIsLoading(true);
      const res = await CategoryService.updateCategory(id, data)
      if (res.success){
        openNotification({
          message: "Thành công",
          description: "Sửa danh mục thành công!",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "green" }} />,
          style: { borderLeft: "5px solid green" },
        })
        router.push("/categories");
        router.refresh();
      }else{
        openNotification({
          message: "Thất bại",
          description: "Sửa danh mục thất bại!",
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
      <ImageInputForm label="Hình ảnh" name="Image" />
      <InputForm label="Tên danh mục" name="CategoryName" placeholder="Nhập tên danh mục" />
      <SelectForm className="w-full" label="Danh mục cha" required={false} name="ParentId" placeholder="Chọn danh mục cha" options={optionSelect} />
      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="mt-4" size="md" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Đang sửa...
            </>
          ) : (
            "Sửa danh mục"
          )}
        </Button>
      </div>
    </Form>
  );
}
