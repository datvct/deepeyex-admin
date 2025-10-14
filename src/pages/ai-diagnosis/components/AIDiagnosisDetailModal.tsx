import React, { useState } from "react";
import { Modal, Button, Card, Tag, Row, Col, Input, message, Progress, Tabs, Image } from "antd";
import {
  RobotOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { AIDiagnosis } from "../mockData";

const { TextArea } = Input;
const { TabPane } = Tabs;

interface AIDiagnosisDetailModalProps {
  diagnosis: AIDiagnosis;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (diagnosisId: string, isCorrect: boolean) => void;
}

const AIDiagnosisDetailModal: React.FC<AIDiagnosisDetailModalProps> = ({
  diagnosis,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [doctorNotes, setDoctorNotes] = useState("");

  const handleConfirm = (isCorrect: boolean) => {
    if (!isCorrect && !doctorNotes.trim()) {
      message.warning("Vui lòng nhập ghi chú khi đánh dấu chẩn đoán không chính xác");
      return;
    }
    onConfirm(diagnosis.diagnosis_id, isCorrect);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    return "#ff4d4f";
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <RobotOutlined className="text-blue-600" />
          <span>Chẩn đoán AI - {diagnosis.patient_name}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="reject"
          type="primary"
          danger
          icon={<CloseOutlined />}
          onClick={() => handleConfirm(false)}
        >
          Không chính xác
        </Button>,
        <Button
          key="confirm"
          type="primary"
          icon={<CheckOutlined />}
          onClick={() => handleConfirm(true)}
        >
          Xác nhận đúng
        </Button>,
      ]}
    >
      <div className="space-y-4">
        {/* Thông tin bệnh nhân - Compact */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserOutlined className="text-gray-500" />
                <span className="font-medium">{diagnosis.patient_name}</span>
              </div>
              <span className="text-gray-600">{diagnosis.patient_age} tuổi</span>
              <span className="text-gray-600">{diagnosis.patient_gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {new Date(diagnosis.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>

        {/* Chẩn đoán AI - Highlight */}
        <Card size="small" className="border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
              <EyeOutlined />
              Chẩn đoán AI
            </h4>
            <div className="flex items-center gap-2">
              <Progress
                percent={diagnosis.confidence_score}
                strokeColor={getConfidenceColor(diagnosis.confidence_score)}
                size="small"
                style={{ width: 80 }}
              />
              <span className="font-bold text-sm">{diagnosis.confidence_score}%</span>
            </div>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed bg-blue-50 p-3 rounded">
            {diagnosis.ai_diagnosis}
          </p>
        </Card>

        {/* Tabs cho thông tin chi tiết */}
        <Tabs size="small" defaultActiveKey="images">
          <TabPane
            tab={
              <span className="flex items-center gap-1">
                <CameraOutlined />
                Ảnh mắt
              </span>
            }
            key="images"
          >
            {diagnosis.eye_images && diagnosis.eye_images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagnosis.eye_images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Ảnh mắt ${index + 1}`}
                      className="rounded-lg border"
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      placeholder={
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CameraOutlined className="text-2xl text-gray-400" />
                        </div>
                      }
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      Ảnh {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CameraOutlined className="text-4xl mb-2" />
                <p>Không có ảnh mắt</p>
              </div>
            )}
          </TabPane>

          <TabPane tab="Triệu chứng" key="symptoms">
            <div className="flex flex-wrap gap-2">
              {diagnosis.symptoms.map((symptom, index) => (
                <Tag key={index} color="blue" className="mb-1">
                  {symptom}
                </Tag>
              ))}
            </div>
          </TabPane>

          <TabPane tab="Điều trị" key="treatment">
            <div className="space-y-2">
              {diagnosis.recommended_treatment.map((treatment, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <MedicineBoxOutlined className="text-green-600 mt-0.5 text-xs" />
                  <span>{treatment}</span>
                </div>
              ))}
            </div>
          </TabPane>

          <TabPane tab="Chẩn đoán khác" key="alternatives">
            <div className="space-y-2">
              {diagnosis.alternative_diagnoses.map((altDiagnosis, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <WarningOutlined className="text-orange-500 mt-0.5 text-xs" />
                  <span>{altDiagnosis}</span>
                </div>
              ))}
            </div>
          </TabPane>

          <TabPane tab="Yếu tố nguy cơ" key="risks">
            <div className="flex flex-wrap gap-2">
              {diagnosis.risk_factors.map((risk, index) => (
                <Tag key={index} color="red" className="text-xs">
                  {risk}
                </Tag>
              ))}
            </div>
          </TabPane>
        </Tabs>

        {/* Ghi chú của bác sĩ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú của bác sĩ</label>
          <TextArea
            rows={3}
            placeholder="Nhập ghi chú của bạn về chẩn đoán này..."
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AIDiagnosisDetailModal;
