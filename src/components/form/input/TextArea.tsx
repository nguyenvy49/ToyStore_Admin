"use client";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Label from "../Label";
import { BaseTextAreaProps } from "@/types/props";
import envConfig from "@/config/envConfig";


const TextArea: React.FC<BaseTextAreaProps> = ({
  name,
  label,
  value,
  placeholder = "Nhập nội dung...",
  className = "",
  disabled = false,
  error = false,
  message,
  onChange,
}) => {
  const editorRef = useRef<any>(null);

  return (
    <div className={`relative ${className}`}>
      {label && <Label>{label}</Label>}

      <div
        className={`rounded-md border ${error ? "border-red-500" : "border-gray-300"
          }`}
      >
        <Editor
          apiKey={envConfig.NEXT_PUBLIC_API_KEY_TINYMCE}
          onInit={(_evt, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={(content) => onChange(content)}
          disabled={disabled}
          init={{
            height: 300,
            menubar: false,
            placeholder,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "image media link | removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            file_picker_types: "image",
            images_upload_url: "/api/upload",
            automatic_uploads: true,
          }}
        />
      </div>

      {/* luôn có giá trị để submit */}
      <input type="hidden" name={name} value={value || ""} />

      {message && (
        <p
          className={`mt-2 text-sm ${error ? "text-red-500" : "text-gray-500"
            }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default TextArea;
