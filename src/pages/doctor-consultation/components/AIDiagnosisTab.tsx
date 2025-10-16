// src/pages/doctor-consultation/components/AIDiagnosisTab.tsx
import React from "react";
import { Card, Row, Col, Tag, Image } from "antd";
import dayjs from "dayjs";
import { AIDiagnosis } from "../../../modules/aidiagnosis/types/aidiagnosis";

interface AIDiagnosisTabProps {
  aiDiagnoses: AIDiagnosis[];
}

const diseaseLabels: Record<string, string> = {
  conjunctivitis: "Viêm kết mạc",
  cataract: "Đục thủy tinh thể",
  glaucoma: "Tăng nhãn áp",
  diabetic_retinopathy: "Bệnh võng mạc do tiểu đường",
  amd: "Thoái hóa điểm vàng",
  normal: "Mắt khỏe",
  keratitiswithulcer: "Viêm giác mạc có loét",
  eyelidedema: "Phù mi mắt",
};

const AIDiagnosisTab: React.FC<AIDiagnosisTabProps> = ({ aiDiagnoses }) => {
  return (
    <div className="space-y-4">
      {aiDiagnoses.map((aiDiag, index) => {
        const confidencePercent = Math.round(aiDiag.confidence * 100);
        const diseaseName = diseaseLabels[aiDiag.disease_code] || aiDiag.disease_code;

        return (
          <Card
            key={aiDiag.id || index}
            className="border-l-4 border-l-purple-500"
            title={
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-700">Chẩn đoán AI #{index + 1}</span>
                <Tag
                  color={
                    aiDiag.status === "APPROVED"
                      ? "green"
                      : aiDiag.status === "REJECTED"
                      ? "red"
                      : "orange"
                  }
                >
                  {aiDiag.status === "APPROVED"
                    ? "Đã xác nhận"
                    : aiDiag.status === "REJECTED"
                    ? "Đã từ chối"
                    : "Chờ xác nhận"}
                </Tag>
              </div>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Bệnh chẩn đoán</label>
                  <p className="text-gray-800 text-lg font-medium">{diseaseName}</p>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Độ tin cậy</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          confidencePercent >= 80
                            ? "bg-green-500"
                            : confidencePercent >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{confidencePercent}%</span>
                  </div>
                </div>
              </Col>
              {aiDiag.eye_type && (
                <Col span={12}>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Vị trí mắt</label>
                    <p className="text-gray-800">
                      {aiDiag.eye_type === "LEFT"
                        ? "Mắt trái"
                        : aiDiag.eye_type === "RIGHT"
                        ? "Mắt phải"
                        : "Cả hai mắt"}
                    </p>
                  </div>
                </Col>
              )}
              <Col span={12}>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Thời gian chẩn đoán</label>
                  <p className="text-gray-800">
                    {dayjs(aiDiag.created_at).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </Col>
              {aiDiag.main_image_url && (
                <Col span={24}>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">
                      Hình ảnh chẩn đoán
                    </label>
                    <Image
                      src={aiDiag.main_image_url}
                      alt="AI Diagnosis"
                      className="rounded-lg border border-gray-200"
                      style={{ maxHeight: 300, objectFit: "contain" }}
                    />
                  </div>
                </Col>
              )}
              {aiDiag.notes && (
                <Col span={24}>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Ghi chú</label>
                    <p className="text-gray-800 bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                      {aiDiag.notes}
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

export default AIDiagnosisTab;
