// src/pages/doctor-consultation/components/ViewMedicalRecordModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Spin, Alert, Descriptions, Image, Tag, Divider, Empty } from "antd";
import { FileTextOutlined, MedicineBoxOutlined, PaperClipOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetMedicalRecordByPatientIdQuery } from "../../../modules/medical-records/hooks/queries/use-get-medical-record-by-patient-id.query";

interface ViewMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName?: string;
}

const ViewMedicalRecordModal: React.FC<ViewMedicalRecordModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
}) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetMedicalRecordByPatientIdQuery(patientId, {
    enabled: !!patientId && isOpen,
  });

  const records = data?.data?.records || [];

  // Debug: log để kiểm tra dữ liệu
  React.useEffect(() => {
    if (records.length > 0) {
      console.log("Records data:", records);
      records.forEach((record, idx) => {
        console.log(`Record ${idx} prescriptions:`, record.prescriptions);
      });
    }
  }, [records]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-blue-600" />
          <span>
            {t("medicalRecord.viewModal.title")} {patientName && `- ${patientName}`}
          </span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip={t("medicalRecord.viewModal.loading")} />
        </div>
      ) : isError ? (
        <Alert
          type="error"
          message={t("medicalRecord.viewModal.errorTitle")}
          description={t("medicalRecord.viewModal.errorDescription")}
          showIcon
        />
      ) : records.length === 0 ? (
        <Empty
          description={t("medicalRecord.viewModal.noRecords")}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Hiển thị tất cả hồ sơ */}
          {records.map((record, index) => (
            <div
              key={record.record_id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              {/* Header của mỗi hồ sơ */}
              <div className="mb-3 pb-2 border-b border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("medicalRecord.viewModal.recordNumber")}
                  {records.length - index} -{" "}
                  {dayjs(record.CreatedAt || record.created_at).format("DD/MM/YYYY HH:mm")}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Thông tin chung */}
                <Descriptions bordered size="small" column={2}>
                  <Descriptions.Item label={t("medicalRecord.viewModal.recordId")}>
                    {record.record_id}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("medicalRecord.viewModal.createdAt")}>
                    {dayjs(record.CreatedAt || record.created_at).format("DD/MM/YYYY HH:mm")}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("medicalRecord.viewModal.diagnosis")} span={2}>
                    <div className="font-medium text-gray-800">{record.diagnosis}</div>
                  </Descriptions.Item>
                  {record.notes && (
                    <Descriptions.Item label={t("medicalRecord.viewModal.notes")} span={2}>
                      {record.notes}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {/* File đính kèm */}
                {record.attachments && record.attachments.length > 0 && (
                  <>
                    <Divider orientation="left">
                      <PaperClipOutlined /> {t("medicalRecord.viewModal.attachments")}
                    </Divider>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {record.attachments.map((att, attIndex) => (
                        <div key={att.id} className="border rounded-lg p-2">
                          {att.file_type.includes("image") ? (
                            <Image
                              src={att.file_url}
                              alt={`Attachment ${attIndex + 1}`}
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
                              {t("medicalRecord.viewModal.viewFile")} {attIndex + 1}
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
                      <MedicineBoxOutlined /> {t("medicalRecord.viewModal.prescriptions")}
                    </Divider>
                    {record.prescriptions.map((prescription, presIndex) => (
                      <div
                        key={prescription.prescription_id}
                        className="bg-white p-3 rounded border"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {t("medicalRecord.viewModal.prescriptionNumber")}
                            {presIndex + 1}
                          </span>
                          <Tag
                            color={
                              prescription.status === "APPROVED"
                                ? "green"
                                : prescription.status === "REJECTED"
                                ? "red"
                                : "orange"
                            }
                          >
                            {t(`medicalRecord.viewModal.status.${prescription.status}`)}
                          </Tag>
                          <Tag color="blue">
                            {t(`medicalRecord.viewModal.source.${prescription.source}`)}
                          </Tag>
                        </div>
                        {prescription.description && (
                          <p className="text-sm text-gray-600 mb-2">{prescription.description}</p>
                        )}
                        {prescription.items && prescription.items.length > 0 ? (
                          <div className="bg-gray-50 p-2 rounded space-y-2 mt-2">
                            {prescription.items.map((item) => (
                              <div
                                key={item.prescription_item_id}
                                className="border-b pb-2 last:border-b-0"
                              >
                                <div className="font-medium">{item.drug_name}</div>
                                <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-1">
                                  <div>
                                    {t("medicalRecord.viewModal.dosage")} {item.dosage}
                                  </div>
                                  <div>
                                    {t("medicalRecord.viewModal.frequency")} {item.frequency}
                                    {!item.frequency.includes("lần") && " lần/ngày"}
                                  </div>
                                  <div>
                                    {t("medicalRecord.viewModal.duration")} {item.duration_days}{" "}
                                    {t("medicalRecord.viewModal.days")}
                                  </div>
                                  <div>
                                    {t("medicalRecord.viewModal.fromDate")}{" "}
                                    {dayjs(item.start_date).format("DD/MM/YYYY")} -{" "}
                                    {dayjs(item.end_date).format("DD/MM/YYYY")}
                                  </div>
                                </div>
                                {item.notes && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    {t("medicalRecord.viewModal.itemNotes")} {item.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 mt-2 italic">
                            {t("medicalRecord.viewModal.noPrescriptionItems")}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {/* AI Diagnoses */}
                {record.ai_diagnoses && record.ai_diagnoses.length > 0 && (
                  <>
                    <Divider orientation="left">{t("medicalRecord.viewModal.aiDiagnosis")}</Divider>
                    <div className="space-y-2">
                      {record.ai_diagnoses.map((ai) => (
                        <div key={ai.id} className="bg-blue-50 p-3 rounded">
                          <div className="flex items-center gap-2">
                            <Tag color="blue">{ai.disease_code}</Tag>
                            <span className="text-sm">
                              {t("medicalRecord.viewModal.confidence")}{" "}
                              {(ai.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          {ai.notes && <p className="text-sm text-gray-600 mt-1">{ai.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default ViewMedicalRecordModal;
