// src/pages/doctor-consultation/components/ExistingAttachments.tsx
import React from "react";
import { Card, Image, Tag } from "antd";
import { FileImageOutlined, FilePdfOutlined, FileOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Attachment } from "../../../modules/medical-records/types/medical-record";

interface ExistingAttachmentsProps {
  attachments: Attachment[];
}

const ExistingAttachments: React.FC<ExistingAttachmentsProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <FileImageOutlined />;
    if (fileType.includes("pdf")) return <FilePdfOutlined />;
    return <FileOutlined />;
  };

  const getFileTypeName = (fileType: string) => {
    if (fileType.includes("image")) return "Hình ảnh";
    if (fileType.includes("pdf")) return "PDF";
    return "File";
  };

  return (
    <Card
      title="File đính kèm hiện có"
      className="mb-4 border-l-4 border-l-indigo-500"
      size="small"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {attachments.map((att, index) => (
          <div key={att.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              {getFileIcon(att.file_type)}
              <span className="text-sm font-medium text-gray-700">File {index + 1}</span>
            </div>
            {att.file_type.includes("image") ? (
              <Image
                src={att.file_url}
                alt={`Attachment ${index + 1}`}
                className="rounded border"
                style={{ width: "100%", height: 100, objectFit: "cover" }}
              />
            ) : (
              <a
                href={att.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Xem file
              </a>
            )}
            <div className="mt-2">
              <Tag color="blue" className="text-xs">
                {getFileTypeName(att.file_type)}
              </Tag>
            </div>
            {att.description && <p className="text-xs text-gray-500 mt-1">{att.description}</p>}
            <p className="text-xs text-gray-400 mt-1">
              {dayjs(att.created_at).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ExistingAttachments;
