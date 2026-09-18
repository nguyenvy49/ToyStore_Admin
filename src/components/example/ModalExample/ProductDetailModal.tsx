"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import { Loading } from "@/components/common/Loading";
import { ProductDetailResType } from "@/schemaValidations/product.schema";
import Badge from "@/components/ui/badge/Badge";

interface ProductDetailProps {
    id: string;
    onHandle: (id: string) => Promise<any>;
    onClose: () => void;
}

export default function ProductDetailModal({
    id,
    onHandle,
    onClose,
}: ProductDetailProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [productDetail, setProductDetail] =
        useState<ProductDetailResType | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await onHandle(id);
                if (res.success) {
                    setProductDetail(res);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, onHandle]);

    if (!productDetail) {
        if (loading) {
            return <Loading />;
        } else {
            return (
                <div className="text-center text-gray-500 italic p-6">
                    Không tìm thấy dữ liệu sản phẩm.
                </div>
            );
        }
    }
    const { result } = productDetail;
    const discountPercent = result.promotion?.discountPercent || 0;
    const finalPrice =
        discountPercent > 0
            ? result.price * (1 - discountPercent / 100)
            : result.price;


    return (
        <div className="relative p-6 bg-white max-w-5xl mx-auto max-h-[90vh] overflow-auto rounded-2xl shadow-lg transition-opacity duration-300">
            {/* Nội dung chính */}
            {loading ? (
                <Loading />
            ) : (
                <div className={loading ? "opacity-50 pointer-events-none" : "opacity-100"}>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center border-b pb-3">
                        🛒 Thông tin sản phẩm
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* ---------- Cột 1: Ảnh sản phẩm ---------- */}
                        <div>
                            {result.image && result.image.length > 0 ? (
                                <div>
                                    {/* Swiper chính */}
                                    <Swiper
                                        loop
                                        spaceBetween={10}
                                        navigation
                                        thumbs={{ swiper: thumbsSwiper }}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className="rounded-2xl mb-4"
                                    >
                                        {result.image.map((src, i) => (
                                            <SwiperSlide key={i}>
                                                <div className="relative w-full h-[350px]">
                                                    <Image
                                                        src={src}
                                                        alt={`Ảnh ${i + 1}`}
                                                        fill
                                                        className="object-cover rounded-2xl border"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* Swiper thumbnails */}
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        spaceBetween={10}
                                        slidesPerView={5}
                                        freeMode
                                        watchSlidesProgress
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className="rounded-xl"
                                    >
                                        {result.image.map((src, i) => (
                                            <SwiperSlide key={i}>
                                                <div className="relative w-full h-20">
                                                    <Image
                                                        src={src}
                                                        alt={`Thumbnail ${i + 1}`}
                                                        fill
                                                        className="object-cover rounded-xl border cursor-pointer opacity-80 hover:opacity-100 transition"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 italic">
                                    Không có hình ảnh sản phẩm.
                                </p>
                            )}
                        </div>

                        {/* ---------- Cột 2: Thông tin chi tiết ---------- */}
                        <div className="space-y-3 text-gray-700">
                            <h3 className="text-xl font-semibold text-green-700">
                                {result.productName}
                            </h3>

                            <p>
                                <span className="font-medium">Nhà cung cấp:</span>{" "}
                                {result.supplier?.name || "Không có"}
                            </p>

                            <p>
                                <span className="font-medium">Danh mục:</span>{" "}
                                {result.category?.parentName || "Chưa có"} ›{" "}
                                {result.category?.childName || "Chưa có"}
                            </p>

                            <p>
                                <span className="font-medium">Số lượng:</span> {result.quantity}
                            </p>

                            <p>
                                <span className="font-medium">Trạng thái:</span>{" "}
                                {result.productStatus === 1 ? (
                                    <Badge color="error" size="sm">
                                        Hết hàng
                                    </Badge>
                                ) : (
                                    <Badge color="success" size="sm">
                                        Còn hàng
                                    </Badge>
                                )}
                            </p>

                            {/* --- Hiển thị giá và khuyến mãi --- */}
                            <div className="mt-3 border-t pt-3 space-y-1">
                                {discountPercent > 0 ? (
                                    <>
                                        <p>
                                            <span className="font-medium">Giá gốc:</span>{" "}
                                            <span className="line-through text-gray-500">
                                                {result.price.toLocaleString("vi-VN")} ₫
                                            </span>
                                        </p>
                                        <p>
                                            <span className="font-medium">Khuyến mãi:</span>{" "}
                                            {discountPercent}%
                                        </p>
                                        <p>
                                            <span className="font-medium text-green-700">
                                                Giá sau khuyến mãi:
                                            </span>{" "}
                                            <span className="text-green-700 font-semibold text-lg">
                                                {finalPrice.toLocaleString("vi-VN")} ₫
                                            </span>
                                        </p>
                                    </>
                                ) : (
                                    <p>
                                        <span className="font-medium">Giá:</span>{" "}
                                        <span className="text-green-700 font-semibold text-lg">
                                            {result.price.toLocaleString("vi-VN")} ₫
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ---------- Mô tả ---------- */}
                    <div className="mt-8 border-t pt-4">
                        <h4 className="font-medium text-gray-800 mb-2">Mô tả sản phẩm:</h4>
                        <div
                            className="prose max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html:
                                    result.description ||
                                    "<p class='italic text-gray-500'>Không có mô tả.</p>",
                            }}
                        />
                    </div>

                    {/* ---------- Nút Đóng ---------- */}
                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={onClose}
                            className="px-8 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
