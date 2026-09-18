"use client";
import { useFormContext } from "@/context/FormContext";
import Form from "../Form";
import Button from "@/components/ui/button/Button";
import { renderData } from "@/hooks/usePrefill";
import InputForm from "../form-elements/InputForm";
import TextAreaForm from "../form-elements/TextAreaForm";
import ImageInputForm from "../form-elements/ImageInputForm";
import { useNotification } from "@/context/NotificationContext";
import { FaRegSmileBeam } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { NewsService } from "@/services/newsService"; // ✅ service news
import { useRouter } from "next/navigation";
import { getFirstImageFromString } from "@/utils/format";

type EditFormProps = {
  id: string;
};

type InfoNews = {
  Title: string;
  Content: string;
  Image: string|null;
};

export default function EditForm({ id }: EditFormProps) {
  const { values, setErrors, setValue } = useFormContext();
  const { openNotification } = useNotification();
  const openNotificationRef = useRef(openNotification);
  const setValueRef = useRef(setValue);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // fetch dữ liệu tin tức
  const fetchDataNews = async (id: string) => {
    const res = await NewsService.infoNews(id);
    if (res.success) {
      const infoNews: InfoNews = {
        Title: res.result.title,
        Content: res.result.content,
        Image: getFirstImageFromString(res.result.image),
      };
      renderData(infoNews, setValueRef.current);
    } else {
      openNotificationRef.current({
        message: "Lỗi",
        description: "Không lấy được thông tin tin tức",
        placement: "top",
        duration: 3,
        icon: <FaRegSmileBeam style={{ color: "red" }} />,
        style: { borderLeft: "5px solid red" },
      });
    }
  };

  useEffect(() => {
    fetchDataNews(id);
  }, [id]);

  const handleSubmit = async (data: Record<string, any> | FormData) => {
    const newErrors: { name: string; message: string }[] = [];

    // validate
    if (!values.Title) newErrors.push({ name: "Title", message: "Tiêu đề không được để trống" });
    if (!values.Content) newErrors.push({ name: "Content", message: "Nội dung không được để trống" });
    if (!values.Image) newErrors.push({ name: "Image", message: "Vui lòng chọn ảnh" });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setIsLoading(true);
      const res = await NewsService.updateNews(id, data);
      console.log(res);
      if (res.success) {
        openNotification({
          message: "Sửa tin tức thành công",
          description: "Tin tức đã được cập nhật.",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "green" }} />,
          style: { borderLeft: "5px solid green" },
        });
        router.push("/news");
        router.refresh();
      } else {
        openNotification({
          message: "Sửa tin tức lỗi",
          description: "Không thể cập nhật tin tức",
          placement: "top",
          duration: 3,
          icon: <FaRegSmileBeam style={{ color: "red" }} />,
          style: { borderLeft: "5px solid red" },
        });
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
      <ImageInputForm label="Hình ảnh" name="Image" />
      <TextAreaForm label="Nội dung" name="Content" placeholder="Nhập nội dung" />
      <div className="flex justify-center">
        <Button type="submit" variant="primary" className="mt-4" size="md" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Đang sửa...
            </>
          ) : (
            "Sửa tin tức"
          )}
        </Button>
      </div>
    </Form>
  );
}
