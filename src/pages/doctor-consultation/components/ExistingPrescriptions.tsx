// src/pages/doctor-consultation/components/ExistingPrescriptions.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Tag, Divider, Empty } from "antd";
import { MedicineBoxOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Prescription } from "../../../modules/medical-records/types/medical-record";

interface ExistingPrescriptionsProps {
  prescriptions: Prescription[];
}

const ExistingPrescriptions: React.FC<ExistingPrescriptionsProps> = ({ prescriptions }) => {
  const { t } = useTranslation();
  if (!prescriptions || prescriptions.length === 0) {
    return null;
  }

  return (
    <Card
      title={
        <span>
          <MedicineBoxOutlined className="mr-2" />
          {t("medicalRecord.prescriptionTab.existingTitle")}
        </span>
      }
      className="mb-4 border-l-4 border-l-green-500"
    >
      {prescriptions.map((prescription, index) => (
        <div key={prescription.prescription_id} className="mb-4 last:mb-0">
          {index > 0 && <Divider />}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-800">
                  {t("medicalRecord.viewModal.prescriptionNumber")}
                  {index + 1}
                </span>
                <Tag
                  color={
                    prescription.status === "APPROVED"
                      ? "green"
                      : prescription.status === "REJECTED"
                      ? "red"
                      : "orange"
                  }
                  icon={
                    prescription.status === "APPROVED" ? (
                      <CheckCircleOutlined />
                    ) : prescription.status === "REJECTED" ? (
                      <CloseCircleOutlined />
                    ) : undefined
                  }
                >
                  {t(`medicalRecord.viewModal.status.${prescription.status}`)}
                </Tag>
                <Tag color="blue">{t(`medicalRecord.viewModal.source.${prescription.source}`)}</Tag>
              </div>
              {prescription.description && (
                <p className="text-sm text-gray-600 mb-2">{prescription.description}</p>
              )}
              <p className="text-xs text-gray-400">
                {t("medicalRecord.prescriptionTab.createdAt")}{" "}
                {dayjs(prescription.created_at).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
          </div>

          {prescription.items && prescription.items.length > 0 && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {t("medicalRecord.viewModal.drugList")}
              </p>
              <div className="space-y-2">
                {prescription.items.map((item, idx) => (
                  <div key={item.prescription_item_id} className="bg-white p-3 rounded border">
                    <h5 className="font-medium text-gray-800 mb-2">{item.drug_name}</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">{t("medicalRecord.viewModal.dosage")}</span>{" "}
                        {item.dosage}
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("medicalRecord.viewModal.frequency")}
                        </span>{" "}
                        {item.frequency}
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("medicalRecord.viewModal.duration")}
                        </span>{" "}
                        {item.duration_days} {t("medicalRecord.viewModal.days")}
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("medicalRecord.viewModal.fromDate")}
                        </span>{" "}
                        {dayjs(item.start_date).format("DD/MM/YYYY")}
                      </div>
                      {item.notes && (
                        <div className="col-span-2">
                          <span className="text-gray-600">
                            {t("medicalRecord.viewModal.itemNotes")}
                          </span>{" "}
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </Card>
  );
};

export default ExistingPrescriptions;
