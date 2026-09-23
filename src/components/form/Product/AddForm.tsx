"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import InputForm from "../form-elements/InputForm";
import TextAreaForm from "../form-elements/TextAreaForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";
import DropzoneImageInput from "../form-elements/DropZone";
import SelectForm from "../form-elements/SelectForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryService } from "@/services/categoryService";
import { SupplierService } from "@/services/supplierService";
import { PromotionService } from "@/services/promotionService";
import { ProductService } from "@/services/productService";

type Option = {
  value: string;
  label: string;
};

export default function AddForm() {
  const { values, setValue, setErrors } = useFormContext();
  const { openNotification } = useNotification();
  const [optionSelectCategory, setOptionSelectCategory] = useState<Option[]>([]);
  const [optionSelectSupplier, setOptionSelectSupplier] = useState<Option[]>([]);
  const [optionSelectPromotion, setOptionSelectPromotion] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const router = useRouter();

  const handleGenerateAiDescription = async () => {
    if (!values.ProductName) {
      openNotification({
        message: "Cảnh báo",
        description: "Vui lòng nhập Tên sản phẩm trước khi gọi AI tạo mô tả!",
        placement: "top",
        duration: 3,
        style: { borderLeft: "5px solid orange" },
      });
      return;
    }

    try {
      setAiGenerating(true);
      const categoryObj = optionSelectCategory.find((c) => c.value === values.IdCategory);
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://cua-hang-do-choi-be.onrender.com").replace(/\/$/, "");

      const res = await fetch(`${baseUrl}/api/Ai/generate-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: values.ProductName,
          categoryName: categoryObj?.label || "Đồ chơi phát triển tư duy",
          ageGroup: "3+",
        }),
      });

      const json = await res.json();
      if (json.success && json.result) {
        const fullDesc = `${json.result.description}\n\nĐẶC ĐIỂM NỔI BẬT:\n${json.result.highlights}`;
        setValue("Description", fullDesc);
        openNotification({
          message: "Thành công",
          description: "AI đã tạo bài viết mô tả sản phẩm và nội dung chuẩn SEO thành công!",
          placement: "top",
          duration: 3,
          style: { borderLeft: "5px solid green" },
        });
      }
    } catch (err) {
      console.error("Lỗi AI Generator:", err);
    } finally {
      setAiGenerating(false);
    }
  };

  const fetchDataCategory = async () =>{ 
    try {
      const resOption = await CategoryService.getListCategory("/api/Category/Admin");
      const options: Option[] = resOption.result.items.map((item: any) => ({
        value: item.id,
        label: item.categoryName,
      }));
      setOptionSelectCategory(options);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchDataSupplier = async () =>{ 
    try {
      const resOption = await SupplierService.getListSupplier("/api/Supplier/Admin");
      const options: Option[] = resOption.result.items.map((item: any) => ({
        value: item.id,
        label: item.supplierName,
      }));
      setOptionSelectSupplier(options);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchDataPromotion = async () =>{ 
    try {
      const resOption = await PromotionService.getListPromotion("/api/Promotion?Type=1");
      const options: Option[] = resOption.result.items.map((item: any) => ({
        value: item.id,
        label: item.title,
      }));
      setOptionSelectPromotion(options);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDataCategory();
    fetchDataSupplier();
    fetchDataPromotion();
  }, []);

  const handleSubmit = async (data: Record<string, any> | FormData) => {
    const newErrors: { name: string; message: string }[] = [];

    // validate text fields
    if (!values.ProductName) newErrors.push({ name: "ProductName", message: "Tiêu đề không được để trống" });
    if (!values.Description) newErrors.push({ name: "Description", message: "Nội dung không được để trống" });
    if (!values.Images) newErrors.push({ name: "Images", message: "Vui lòng chọn ảnh" });
    if (!values.IdCategory) newErrors.push({ name: "IdCategory", message: "Vui lòng chọn danh mục" });
    if (!values.IdSupplier) newErrors.push({ name: "IdSupplier", message: "Vui lòng chọn thương hiệu" });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setIsLoading(true);
      try{
        const res = await ProductService.createProduct(data)
        console.log(res);
        if(res.success){
          openNotification({
            message: "Thành công",
            description: "Thêm sản phẩm thành công!",
            placement: "top",
            duration: 3,
            icon: <FaRegSmileBeam style={{ color: "green" }} />,
            style: { borderLeft: "5px solid green" },
          })
          router.push("/products");
          router.refresh();
        }else{
          openNotification({
            message: "Thất bại",
            description: "Thêm sản phẩm thất bại!",
            placement: "top",
            duration: 3,
            icon: <FaRegSmileBeam style={{ color: "red" }} />,
            style: { borderLeft: "5px solid red" },
          })
          setIsLoading(false);
        }
      }catch(error){
        openNotification({
          message: "Thất bại",
          description: "Thêm sản phẩm thất bại: "+error,
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "red" }} />,
          style: { borderLeft: "5px solid red" },
        })
        setIsLoading(false);
      }finally{
        setIsLoading(false);
      }
    } else {
      console.log("❌ Errors:", newErrors);
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} mode="multipart">
      <InputForm label="Tên sản phẩm" name="ProductName" placeholder="Nhập tên sản phẩm" />
      <DropzoneImageInput name="Images" multiple className="mt-4"/>
      <InputForm label="Giá" name="Price" placeholder="Nhập giá" type="number" />
      <div className="flex flex-nowrap gap-4 mt-4 w-full items-center">
        <SelectForm className="w-full" label="Danh mục" name="IdCategory" placeholder="Chọn danh mục" options={optionSelectCategory} />
        <SelectForm className="w-full" label="Thương hiệu" name="IdSupplier" placeholder="Chọn thương hiệu" options={optionSelectSupplier} />
        <SelectForm className="w-full" label="Khuyến mãi" name="IdPromotion" placeholder="Chọn khuyến mãi" options={optionSelectPromotion} />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mô tả sản phẩm
          </label>
          <button
            type="button"
            onClick={handleGenerateAiDescription}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-semibold hover:opacity-95 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {aiGenerating ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Đang tạo bài viết AI...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
                <span>AI Viết Mô tả & SEO</span>
              </>
            )}
          </button>
        </div>
        <TextAreaForm label="" name="Description" placeholder="Nhập mô tả sản phẩm (Hoặc bấm '✨ AI Viết Mô tả & SEO' để AI tự động soạn bài)..." />
      </div>
      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="mt-4" size="md" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Đang thêm...
            </>
          ) : (
            "Thêm sản phẩm"
          )}
        </Button>
      </div>
    </Form>
  );
}
