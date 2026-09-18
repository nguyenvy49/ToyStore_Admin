"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RiBillLine } from "react-icons/ri";
import BaseDatePicker from "../form/date-picker";
import BaseSelect from "../form/select/select";
import { useTableContext } from "@/context/TableContext";
import { StatisticService } from "@/services/statisticService";

const OrderMetric = () => {
    const [value, setValue] = useState<number>(0);
    const { urlApi, setParam } = useTableContext();
    const setParamRef = useRef(setParam);
    const [valueOption, setValueOption] = useState<number>(-1);
    const today = new Date();
    const localDate = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
    const handleChangeSelect = (value: string | number | (string | number)[]) => {
        setValueOption(value as number);
    }
    const handleChangeDatePicker = (value: string | string[]) => {
        setParam("day", new Date(value as string).toISOString());
    }
    const getValue = useCallback(async (urlApi: string) => {
        try {
            const res = await StatisticService.statistic(urlApi);
            if (res) {
                switch (valueOption) {
                    case 0: setValue(res.choXuLy); break;
                    case 1: setValue(res.xacNhan); break;
                    case 2: setValue(res.dangGiao); break;
                    case 3: setValue(res.daGiao); break;
                    case 4: setValue(res.daHuy); break;
                    default:
                        setValue(res.daHuy + res.daGiao + res.dangGiao + res.xacNhan + res.choXuLy);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [valueOption]); // valueOption là dependency

    useEffect(() => {
        setParamRef.current("day", new Date(localDate as string).toISOString());
    }, [localDate]);

    useEffect(() => {
        getValue(urlApi);
    }, [urlApi, getValue]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            {/* Filter */}
            <div className="flex flex-col gap-2">
                <BaseDatePicker onChange={handleChangeDatePicker} size="xxs" id="date" name="date" placeholder="Lọc theo ngày" value={localDate} />
                <BaseSelect
                    name="status"
                    placeholder="Lọc theo trạng thái"
                    size="xxs"
                    options={[
                        { label: "Chờ xác nhận", value: 0 },
                        { label: "Đã xác nhận", value: 1 },
                        { label: "Đang giao", value: 2 },
                        { label: "Hoàn thành", value: 3 },
                        { label: "Đã hủy", value: 4 },
                        { label: "Tất cả", value: -1 },
                    ]}
                    onChange={handleChangeSelect}
                    value={valueOption}
                />
            </div>

            {/* Metric Info */}
            <div className="flex items-end justify-between mt-2">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Đơn hàng</span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{value}</h4>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <RiBillLine size={20} className="text-gray-800 dark:text-white/90" />
                </div>
            </div>
        </div>
    );
};

export default OrderMetric;
