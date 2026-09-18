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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryService } from "@/services/categoryService";
import { SupplierService } from "@/services/supplierService";
import { PromotionService } from "@/services/promotionService";
import { ProductService } from "@/services/productService";
import { EditFormProps } from "@/types/props";
import { renderData } from "@/hooks/usePrefill";

type Option = {
    value: string;
    label: string;
};

type InfoProduct ={
  ProductName: string;
  Description?: string;
  Images?: string[];
  Price: number;
  IdCategory: string;
  IdSupplier: string;
  IdPromotion?:string;
}

export default function EditForm({ id }: EditFormProps) {
    const { values, setErrors, setValue } = useFormContext();
    const { openNotification } = useNotification();
    const openNotificationRef = useRef(openNotification);
    const [optionSelectCategory, setOptionSelectCategory] = useState<Option[]>([]);
    const [optionSelectSupplier, setOptionSelectSupplier] = useState<Option[]>([]);
    const [optionSelectPromotion, setOptionSelectPromotion] = useState<Option[]>([]);
    const setValueRef = useRef(setValue);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const fetchDataCategory = async () => {
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
    const fetchDataSupplier = async () => {
        try {
            const resOption = await SupplierService.getListSupplier("/api/Supplier/Admin");
            console.log(resOption);
            const options: Option[] = resOption.result.items.map((item: any) => ({
                value: item.id,
                label: item.supplierName,
            }));
            setOptionSelectSupplier(options);
        } catch (error) {
            console.log(error);
        }
    }
    const fetchDataPromotion = async () => {
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
    const fetchDataProduct = async (id: string) => {
        // Lấy thông tin infoProduct khuyến mãi
          const res = await ProductService.infoProduct(id);
          console.log(res);
          if (res.success) {
            const infoProduct: InfoProduct = {
                ProductName:res.result.productName,
                IdCategory:res.result.category.id,
                IdSupplier:res.result.supplier.id,
                Price:res.result.price,
                IdPromotion:res.result.promotion?.id,
                Description:res.result.description,
                Images:res.result.image
            };
            renderData(infoProduct, setValueRef.current);
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
        fetchDataCategory();
        fetchDataSupplier();
        fetchDataPromotion();
        fetchDataProduct(id)
    }, [id]);

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
            try {
                const res = await ProductService.updateProduct(id,data)
                console.log(res);
                if (res.success) {
                    openNotification({
                        message: "Thành công",
                        description: "Sửa sản phẩm thành công!",
                        placement: "top",
                        duration: 3,
                        icon: <FaRegSmileBeam style={{ color: "green" }} />,
                        style: { borderLeft: "5px solid green" },
                    })
                    router.push("/products");
                    router.refresh();
                } else {
                    openNotification({
                        message: "Thất bại",
                        description: "Sửa sản phẩm thất bại!",
                        placement: "top",
                        duration: 3,
                        icon: <FaRegSmileBeam style={{ color: "red" }} />,
                        style: { borderLeft: "5px solid red" },
                    })
                    setIsLoading(false);
                }
            } catch (error) {
                openNotification({
                    message: "Thất bại",
                    description: "Sửa sản phẩm thất bại: " + error,
                    placement: "top",
                    duration: 3,
                    icon: <FaRegSmileBeam style={{ color: "red" }} />,
                    style: { borderLeft: "5px solid red" },
                })
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.log("❌ Errors:", newErrors);
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} mode="multipart" >
            <InputForm label="Tên sản phẩm" name="ProductName" placeholder="Nhập tên sản phẩm" />
            <DropzoneImageInput name="Images" multiple className="mt-4" />
            <InputForm label="Giá" name="Price" placeholder="Nhập giá" type="number" />
            <div className="flex flex-nowrap gap-4 mt-4 w-full items-center">
                <SelectForm className="w-full" label="Danh mục" name="IdCategory" placeholder="Chọn danh mục" options={optionSelectCategory} />
                <SelectForm className="w-full" label="Thương hiệu" name="IdSupplier" placeholder="Chọn thương hiệu" options={optionSelectSupplier} />
                <SelectForm className="w-full" label="Khuyến mãi" name="IdPromotion" placeholder="Chọn khuyến mãi" options={optionSelectPromotion} />
            </div>
            <TextAreaForm label="Mô tả" name="Description" placeholder="Nhập mô tả" />
            <div className="flex justify-center">
                <Button type="submit" variant="primary" className="mt-4" size="md" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                            Đang sửa...
                        </>
                    ) : (
                        "Sửa sản phẩm"
                    )}
                </Button>
            </div>
        </Form>
    );
}
