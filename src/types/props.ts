import { ReactNode } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

type EditFormProps = {
  id: string;
};

interface FileInputProps {
  id?: string;
  name: string;
  multiple?: boolean;
  label?: string;
  className?: string;
  error?: boolean;
  hint?: string;
}
interface DropzoneImageInputProps {
  name: string;
  multiple?: boolean;
  className?: string;
  error?: boolean;
  hint?: string;
}

interface BaseProps {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

interface InputProps {
  id: string; // Unique ID cho input
  name: string; // Tên field
  type?: string; // text, email, number, password...
  value: string; // Giá trị của input
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  message?: string;
  className?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

interface TextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

interface BaseTextAreaProps {
  name: string;
  label?: string;
  value: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  message?: string;
  onChange: (value: string) => void;
}

interface FormProps {
  onSubmit: (data: Record<string, any> | FormData) => void;
  children: ReactNode;
  className?: string;
  mode?: "json" | "multipart";
  method?: "POST" | "PUT" | "PATCH" | "DELETE"
}

interface SelectFieldProps {
  name: string;
  label?: string;
  size?:string;
  options: { value: string | number; label: string }[];
  mode?: "multiple" | "tags" | undefined;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hint?: string;
  required?: boolean;
  isModel?:boolean;
}

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string; // tên field trong form
  title?: string; // tiêu đề (optional)
  options: RadioOption[]; // danh sách các option
  defaultValue?: string; 
  className?: string;
  onChange?: (value: string) => void;
}

interface CheckboxProps {
  id?: string;
  name?: string;
  value?: any;
  label?: string;
  checked: boolean;
  disabled?: boolean;
  className?: string;
  onChange: (checked: boolean) => void;
}

interface BaseSelectProps {
  id?: string;
  name: string;
  label?: string;
  size?:string;
  options: { label: string ; value: string | number }[];
  value?: string | number | (string | number)[] | undefined;
  mode?: "multiple" | "tags";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  message?: string;
  onChange: (val: string | number | (string | number)[]) => void; // ✅ khớp với value
  onBlur?: () => void;
  onSearch?: (val: string) => void;
  searchValue?: string;
  isModel?: boolean;
}

// Cho từng option trong CheckboxGroup
interface CheckboxOption {
  label: string;               // nhãn hiển thị
  value: string | number;      // giá trị của option
  disabled?: boolean;          // có disable hay không
}

// Cho toàn bộ group
interface CheckboxGroupProps {
  name: string;                // tên field (key trong FormContext)
  title?: string;              // tiêu đề group
  options: CheckboxOption[];   // danh sách các option
}

interface BaseSwitchProps {
  id?: string;
  name: string;
  size?:string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  color?: "blue" | "gray";
  onLabel?: string;
  offLabel?: string;
  className?: string;
}

interface SwitchFormProps {
  name: string;
  label?: string;
  size?:string;
  onLabel?: string;   // ✅ text khi bật
  offLabel?: string;  // ✅ text khi tắt";
  defaultChecked?: boolean;
  disabled?: boolean;
  color?: "blue" | "gray";
  className?: string;
}

type DatePickerFormProps = {
  id: string;
  name: string;
  label?: string;
  size?:string;
  className?: string;
  placeholder?: string;
  mode?: "single" | "multiple" | "range" | "time";
  required?: boolean;
};

type BaseDatePickerProps = {
  id: string;
  name: string;
  className?: string;
  size?:string;
  mode?: "single" | "multiple" | "range" | "time";
  defaultDate?: flatpickr.Options.DateOption;
  placeholder?: string;
  onChange?: (val: string | string[]) => void;
  value?: string | string[];
  onBlur?: () => void;
};

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  linkBtn?: string; // Link for the button
  titleBtn?: string; // Title for the button
  isAdd?: boolean; // Title for the button
  isDelete?: boolean; // Title for the button
}

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
  id?:string;
  style?: React.CSSProperties;
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  colSpan ?: number; // Optional colspan,
  rowSpan ?: number; // Optional rowspan,
}

export type {
  FileInputProps,
  DropzoneImageInputProps,
  BaseProps,
  InputProps,
  TextareaProps,
  BaseTextAreaProps,
  FormProps,
  SelectFieldProps,
  RadioGroupProps,
  CheckboxProps,
  BaseSelectProps,
  CheckboxGroupProps,
  BaseSwitchProps,
  SwitchFormProps,
  DatePickerFormProps,
  BaseDatePickerProps,
  ComponentCardProps,
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  EditFormProps,

};