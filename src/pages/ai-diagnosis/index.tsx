import React, { useState } from "react";
import { Button, Card, Tag, message } from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  RobotOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { mockAIDiagnoses, AIDiagnosis } from "./mockData";
import AIDiagnosisDetailModal from "./components/AIDiagnosisDetailModal";

const AIDiagnosisPage: React.FC = () => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<AIDiagnosis | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDiagnosis = (diagnosis: AIDiagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDiagnosis(null);
  };

  const handleConfirmDiagnosis = (diagnosisId: string, isCorrect: boolean) => {
    // Mock function - trong thực tế sẽ gọi API
    console.log(`Xác nhận chẩn đoán ${diagnosisId}: ${isCorrect ? "Đúng" : "Sai"}`);
    message.success(
      isCorrect ? "Đã xác nhận chẩn đoán đúng" : "Đã đánh dấu chẩn đoán không chính xác",
    );
    setIsDetailModalOpen(false);
    setSelectedDiagnosis(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "green";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "rejected":
        return "Không chính xác";
      default:
        return status;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "orange";
    return "red";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <RobotOutlined className="text-blue-600" />
          Chẩn đoán AI - Nhãn khoa
        </h1>
        <p className="text-gray-600">
          Danh sách các chẩn đoán bệnh mắt do AI thực hiện cần xác nhận
        </p>
      </div>

      {mockAIDiagnoses.length === 0 ? (
        <div className="text-center py-12">
          <RobotOutlined className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">Không có chẩn đoán AI nào</h3>
          <p className="text-gray-400">Hiện tại không có chẩn đoán bệnh mắt AI nào cần xác nhận</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {mockAIDiagnoses.map((diagnosis) => (
            <Card
              key={diagnosis.diagnosis_id}
              className="hover:shadow-lg transition-shadow"
              actions={[
                <Button
                  key="view"
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDiagnosis(diagnosis)}
                >
                  Xem chi tiết
                </Button>,
              ]}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <RobotOutlined className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {diagnosis.patient_name}
                        </h3>
                        {diagnosis.eye_images && diagnosis.eye_images.length > 0 && (
                          <CameraOutlined className="text-green-600 text-sm" title="Có ảnh mắt" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">ID: {diagnosis.diagnosis_id}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Triệu chứng:</h4>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.symptoms.map((symptom, index) => (
                        <Tag key={index} color="blue">
                          {symptom}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-1">Chẩn đoán AI:</h4>
                    <p className="text-gray-800 bg-gray-50 p-2 rounded">{diagnosis.ai_diagnosis}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Độ tin cậy</p>
                      <Tag color={getConfidenceColor(diagnosis.confidence_score)}>
                        {diagnosis.confidence_score}%
                      </Tag>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Trạng thái</p>
                      <Tag color={getStatusColor(diagnosis.status)}>
                        {getStatusText(diagnosis.status)}
                      </Tag>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Thời gian</p>
                      <p className="text-gray-800">
                        {new Date(diagnosis.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedDiagnosis && (
        <AIDiagnosisDetailModal
          diagnosis={selectedDiagnosis}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onConfirm={handleConfirmDiagnosis}
        />
      )}
    </div>
  );
};

export default AIDiagnosisPage;
