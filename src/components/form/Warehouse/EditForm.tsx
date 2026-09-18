"use client";
import { EditFormProps } from "@/types/props";


// type Option = {
//     value: string;
//     label: string;
// };

// type InfoWarehouse ={
//     IdProduct: string[];
//     IdSupplier: string[];
//     Price: number;
//     Quantity: number;
// }
export default function EditForm({ id }: EditFormProps) {
    console.log(id);
    // const { values, setErrors, setValue } = useFormContext();
    // const { openNotification } = useNotification();
    // const [optionSelectProduct, setOptionSelectProduct] = useState<Option[]>([]);
    // const [optionSelectSupplier, setOptionSelectSupplier] = useState<Option[]>([]);
    // const setValueRef = useRef(setValue);
    // const openNotificationRef = useRef(openNotification);
    // const [isLoading, setIsLoading] = useState(false);

    // const fetchDataProducts = async (id: string) => {
    //     // Lấy thông tin kho hàng
    //     const resOption = await ProductService.getListProduct("/api/Product/admin");
    //     const options: Option[] = resOption.result.items.map((item: any) => ({
    //       value: item.id,
    //       label: item.productName,
    //     }));
    //     setOptionSelectProduct(options);
    // }

    // const fetchDataSuppliers = async (id: string) => {
    //     const resOption = await SupplierService.getListSupplier("/api/Supplier/Admin");
    //     const options: Option[] = resOption.result.items.map((item: any) => ({
    //       value: item.id,
    //       label: item.supplierName,
    //     }));
    //     setOptionSelectSupplier(options);
    // }

    // // const fetchDataWarehouse = async (id: string) => {
    // //     const res = await WarehouseService.infoWarehouse(id);
    // //     if (res.success) {
    // //         const infoWarehouse: InfoWarehouse = {
    // //             IdProduct: [res.result.product.id],
    // //             IdSupplier: [res.result.product.supplierId],
    // //             Price: res.result.price,
    // //             Quantity: res.result.quantity,
    // //         };
    // //         renderData(infoWarehouse, setValueRef.current);
    // //     }else {
    // //         openNotificationRef.current({
    // //             message: "Lấy thông tin sản phẩm trong kho lỗi",
    // //             description: "Không lấy được thông tin sản phẩm trong kho",
    // //             placement: "top",
    // //             duration: 3,
    // //             icon: <FaRegSmileBeam style={{ color: "red" }} />,
    // //             style: { borderLeft: "5px solid red" },
    // //         });
    // //     }
    // // }

    // const handleSubmit = (data: Record<string, any> | FormData) => {
    //     const newErrors: { name: string; message: string }[] = [];

    //     // validate text fields
    //     if (!values.product) newErrors.push({ name: "product", message: "Tiêu đề không được để trống" });
    //     if (!values.description) newErrors.push({ name: "description", message: "Nội dung không được để trống" });
    //     if (!values.images) newErrors.push({ name: "images", message: "Vui lòng chọn ảnh" });

    //     setErrors(newErrors);

    //     if (newErrors.length === 0) {
    //         if (data instanceof FormData) {
    //             // multipart submit
    //             console.log("🚀 Multipart FormData submit:");
    //             for (const [key, value] of data.entries()) {
    //                 console.log(key, value);
    //             }
    //             console.log("Categories:", data); // nếu là multi select
    //         } else {
    //             // json submit
    //             console.log("🚀 JSON submit:", data);
    //         }
    //         openNotification({
    //             message: "Custom Notification",
    //             description: "Nội dung chi tiết thông báo",
    //             placement: "top",
    //             duration: 3,
    //             icon: <FaRegSmileBeam style={{ color: "green" }} />,
    //             style: { borderLeft: "5px solid green" },
    //         })
    //     } else {
    //         console.log("❌ Errors:", newErrors);
    //     }
    // };

    // return (
    //     <Form onSubmit={handleSubmit} mode="multipart">
    //         <SelectForm className="w-full" label="Sản phẩm" name="product" placeholder="Chọn sản phẩm" options={[{ value: '1', label: 'Sản phẩm 1' }, { value: '2', label: 'Sản phẩm 2' }]}  />
    //         <DatePickerForm
    //             id="publishDate"
    //             name="publishDate"
    //             label="Ngày nhập kho"
    //             placeholder="Chọn ngày nhập kho"
    //             mode="single"
    //             required
    //         />
    //         <div className="flex flex-nowrap gap-4 mt-4 w-full justify-center">
    //             <InputForm label="Giá" name="price" className="w-full" placeholder="Nhập giá" type="number" />
    //             <InputForm label="Số lượng" name="quantity" className="w-full" placeholder="Nhập số lượng" type="number" />
    //             <InputForm label="Tổng tiền" name="total" className="w-full" disabled />
    //             <SwitchForm
    //                 name="switch1"
    //                 defaultChecked={true}
    //                 onLabel="Hot"
    //                 offLabel="Normal"
    //                 label="Trạng thái"
    //                 size="xl"
    //             />
    //         </div>
    //         <div className="flex justify-center">
    //             <Button type="submit" variant="primary" className="mt-4" size="md">
    //                 Sửa Sản Phẩm Trong Kho
    //             </Button>
    //         </div>
    //     </Form>
    // );
}
