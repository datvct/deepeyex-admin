// src/pages/doctor-consultation/components/ViewMedicalRecordModal.tsx
import React from "react";
import { Modal, Spin, Alert, Descriptions, Image, Tag, Divider } from "antd";
import { FileTextOutlined, MedicineBoxOutlined, PaperClipOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetMedicalRecordQuery } from "../../../modules/medical-records/hooks/queries/use-get-medical-record.query";

interface ViewMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
}

const ViewMedicalRecordModal: React.FC<ViewMedicalRecordModalProps> = ({
  isOpen,
  onClose,
  recordId,
}) => {
  const { data, isLoading, isError } = useGetMedicalRecordQuery(recordId, {
    enabled: !!recordId && isOpen,
  });

  const record = data?.data;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-blue-600" />
          <span>Xem hồ sơ bệnh án</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={900}
      footer={null}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip="Đang tải hồ sơ..." />
        </div>
      ) : isError ? (
        <Alert
          type="error"
          message="Lỗi tải dữ liệu"
          description="Không thể tải hồ sơ bệnh án. Vui lòng thử lại sau."
          showIcon
        />
      ) : record ? (
        <div className="space-y-4">
          {/* Thông tin chung */}
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Mã hồ sơ">{record.record_id}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(record.created_at).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Chẩn đoán" span={2}>
              <div className="font-medium text-gray-800">{record.diagnosis}</div>
            </Descriptions.Item>
            {record.notes && (
              <Descriptions.Item label="Ghi chú" span={2}>
                {record.notes}
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* File đính kèm */}
          {record.attachments && record.attachments.length > 0 && (
            <>
              <Divider orientation="left">
                <PaperClipOutlined /> File đính kèm
              </Divider>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {record.attachments.map((att, index) => (
                  <div key={att.id} className="border rounded-lg p-2">
                    {att.file_type.includes("image") ? (
                      <Image
                        src={att.file_url}
                        alt={`Attachment ${index + 1}`}
                        className="rounded"
                        style={{ width: "100%", height: 120, objectFit: "cover" }}
                      />
                    ) : (
                      <a
                        href={att.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Xem file {index + 1}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Toa thuốc */}
          {record.prescriptions && record.prescriptions.length > 0 && (
            <>
              <Divider orientation="left">
                <MedicineBoxOutlined /> Toa thuốc
              </Divider>
              {record.prescriptions.map((prescription, index) => (
                <div key={prescription.prescription_id} className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Toa thuốc #{index + 1}</span>
                    <Tag
                      color={
                        prescription.status === "APPROVED"
                          ? "green"
                          : prescription.status === "REJECTED"
                          ? "red"
                          : "orange"
                      }
                    >
                      {prescription.status === "APPROVED"
                        ? "Đã duyệt"
                        : prescription.status === "REJECTED"
                        ? "Đã từ chối"
                        : "Chờ duyệt"}
                    </Tag>
                    <Tag color="blue">{prescription.source === "AI" ? "AI" : "Bác sĩ"}</Tag>
                  </div>
                  {prescription.description && (
                    <p className="text-sm text-gray-600 mb-2">{prescription.description}</p>
                  )}
                  {prescription.items && prescription.items.length > 0 && (
                    <div className="bg-white p-2 rounded space-y-2 mt-2">
                      {prescription.items.map((item) => (
                        <div
                          key={item.prescription_item_id}
                          className="border-b pb-2 last:border-b-0"
                        >
                          <div className="font-medium">{item.drug_name}</div>
                          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-1">
                            <div>Liều lượng: {item.dosage}</div>
                            <div>Tần suất: {item.frequency}</div>
                            <div>Thời gian: {item.duration_days} ngày</div>
                            <div>Từ: {dayjs(item.start_date).format("DD/MM/YYYY")}</div>
                          </div>
                          {item.notes && (
                            <div className="text-sm text-gray-500 mt-1">Ghi chú: {item.notes}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* AI Diagnoses */}
          {record.ai_diagnoses && record.ai_diagnoses.length > 0 && (
            <>
              <Divider orientation="left">Chẩn đoán AI</Divider>
              <div className="space-y-2">
                {record.ai_diagnoses.map((ai) => (
                  <div key={ai.id} className="bg-blue-50 p-3 rounded">
                    <div className="flex items-center gap-2">
                      <Tag color="blue">{ai.disease_code}</Tag>
                      <span className="text-sm">
                        Độ tin cậy: {(ai.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    {ai.notes && <p className="text-sm text-gray-600 mt-1">{ai.notes}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <Alert type="warning" message="Không tìm thấy hồ sơ" showIcon />
      )}
    </Modal>
  );
};

export default ViewMedicalRecordModal;
