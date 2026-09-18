"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import InputForm from "../form-elements/InputForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";
import SelectForm from "../form-elements/SelectForm";
import ImageInputForm from "../form-elements/ImageInputForm";
import { useEffect, useState } from "react";
import { CategoryService } from "@/services/categoryService";
import { useRouter } from "next/navigation";

type Option = {
  value: string;
  label: string;
};

export default function AddForm() {
  const { values, setErrors} = useFormContext();
  const { openNotification } = useNotification();
  const [optionSelect, setOptionSelect] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resOption = await CategoryService.getListCategory("/api/Category/Admin");
        console.log(resOption);
        const options: Option[] = resOption.result.items.map((item: any) => ({
          value: item.id,
          label: item.categoryName,
        }));
        setOptionSelect(options);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, []);

  const handleSubmit = async (data: Record<string, any> | FormData) => {
    const newErrors: { name: string; message: string }[] = [];

    // validate text fields
    if (!values.CategoryName) newErrors.push({ name: "CategoryName", message: "Tiêu đề không được để trống" });
    if (!values.Image) newErrors.push({ name: "Image", message: "Vui lòng chọn ảnh" });
    if (!values.ParentId) newErrors.push({ name: "ParentId", message: "Vui lòng chọn danh mục cha" });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setIsLoading(true);
      try{
        const res = await CategoryService.createCategory(data);
        console.log(res);
        openNotification({
          message: "Thành công",
          description: "Thêm mới danh mục thành công!",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "green" }} />,
          style: { borderLeft: "5px solid green" },
        })
        router.push("/categories");
        router.refresh();
      }catch(error){
        openNotification({
          message: "Custom Notification",
          description: "Thêm mới danh mục thất bại: "+ error,
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
      <SelectForm className="w-full" label="Danh mục cha" name="ParentId" placeholder="Chọn danh mục cha" options={optionSelect} />
      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="mt-4" size="md" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Đang thêm...
            </>
          ) : (
            "Thêm danh mục"
          )}
        </Button>
      </div>
    </Form>
  );
}
