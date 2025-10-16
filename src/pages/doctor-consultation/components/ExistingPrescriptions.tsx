// src/pages/doctor-consultation/components/ExistingPrescriptions.tsx
import React from "react";
import { Card, Tag, Divider, Empty } from "antd";
import { MedicineBoxOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Prescription } from "../../../modules/medical-records/types/medical-record";

interface ExistingPrescriptionsProps {
  prescriptions: Prescription[];
}

const ExistingPrescriptions: React.FC<ExistingPrescriptionsProps> = ({ prescriptions }) => {
  if (!prescriptions || prescriptions.length === 0) {
    return null;
  }

  return (
    <Card
      title={
        <span>
          <MedicineBoxOutlined className="mr-2" />
          Toa thuốc đã có
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
                <span className="font-semibold text-gray-800">Toa thuốc #{index + 1}</span>
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
              <p className="text-xs text-gray-400">
                Tạo lúc: {dayjs(prescription.created_at).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
          </div>

          {prescription.items && prescription.items.length > 0 && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-semibold text-gray-700 mb-2">Danh sách thuốc:</p>
              <div className="space-y-2">
                {prescription.items.map((item, idx) => (
                  <div key={item.prescription_item_id} className="bg-white p-3 rounded border">
                    <h5 className="font-medium text-gray-800 mb-2">{item.drug_name}</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Liều lượng:</span> {item.dosage}
                      </div>
                      <div>
                        <span className="text-gray-600">Tần suất:</span> {item.frequency}
                      </div>
                      <div>
                        <span className="text-gray-600">Thời gian:</span> {item.duration_days} ngày
                      </div>
                      <div>
                        <span className="text-gray-600">Từ ngày:</span>{" "}
                        {dayjs(item.start_date).format("DD/MM/YYYY")}
                      </div>
                      {item.notes && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Ghi chú:</span> {item.notes}
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
