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
  EditOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { AIDiagnosis } from "../../../modules/aidiagnosis/types/aidiagnosis";
import SignaturePad from "./SignaturePad";

const { TextArea } = Input;
const { TabPane } = Tabs;

// Disease labels mapping
const diseaseLabels: Record<string, string> = {
  conjunctivitis: "Viêm kết mạc",
  eyelidedema: "Phù mi mắt",
  healthy_eye: "Mắt khỏe mạnh",
  hordeolum: "Lẹo mắt",
  keratitiswithulcer: "Viêm giác mạc có loét",
  subconjunctival_hemorrhage: "Xuất huyết dưới kết mạc",
};

interface AIDiagnosisDetailModalProps {
  diagnosis: AIDiagnosis;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (diagnosisId: string, isCorrect: boolean, notes?: string, signature?: File) => void;
}

const AIDiagnosisDetailModal: React.FC<AIDiagnosisDetailModalProps> = ({
  diagnosis,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [doctorNotes, setDoctorNotes] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>("");
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const handleConfirm = (isCorrect: boolean) => {
    // Chỉ yêu cầu ghi chú khi đánh dấu KHÔNG CHÍNH XÁC
    if (!isCorrect && !doctorNotes.trim()) {
      message.warning("Vui lòng nhập ghi chú khi đánh dấu chẩn đoán không chính xác");
      return;
    }

    // Yêu cầu chữ ký
    if (!signatureFile) {
      message.warning("Vui lòng ký xác nhận trước khi gửi");
      setShowSignaturePad(true);
      return;
    }

    onConfirm(diagnosis.id, isCorrect, doctorNotes.trim() || undefined, signatureFile);
  };

  const handleReject = () => {
    // Yêu cầu chữ ký
    if (!signatureFile) {
      message.warning("Vui lòng ký xác nhận trước khi gửi");
      setShowSignaturePad(true);
      return;
    }

    onConfirm(diagnosis.id, false, doctorNotes.trim() || undefined, signatureFile);
  };

  const handleSaveSignature = (file: File) => {
    setSignatureFile(file);
    const previewUrl = URL.createObjectURL(file);
    setSignaturePreview(previewUrl);
    setShowSignaturePad(false);
    message.success("Đã lưu chữ ký");
  };

  const handleRemoveSignature = () => {
    setSignatureFile(null);
    setSignaturePreview("");
    message.info("Đã xóa chữ ký");
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    return "#ff4d4f";
  };

  const confidencePercent = Math.round(diagnosis.confidence * 100);
  const diseaseName = diseaseLabels[diagnosis.disease_code] || diagnosis.disease_code;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <RobotOutlined className="text-blue-600" />
          <span>Chẩn đoán AI - Patient ID: {diagnosis.patient_id.slice(0, 8)}...</span>
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
          onClick={() => handleReject()}
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
        {/* Thông tin chẩn đoán - Compact */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserOutlined className="text-gray-500" />
                <span className="font-medium">
                  Patient ID: {diagnosis.patient_id.slice(0, 13)}...
                </span>
              </div>
              {diagnosis.eye_type && (
                <Tag color="blue">
                  {diagnosis.eye_type === "both" ? "Cả 2 mắt" : diagnosis.eye_type}
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {new Date(diagnosis.created_at).toLocaleString("vi-VN")}
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
                percent={confidencePercent}
                strokeColor={getConfidenceColor(confidencePercent)}
                size="small"
                style={{ width: 80 }}
              />
              <span className="font-bold text-sm">{confidencePercent}%</span>
            </div>
          </div>
          <p className="text-gray-800 text-base font-semibold leading-relaxed bg-blue-50 p-3 rounded">
            {diseaseName}
          </p>
          {diagnosis.notes && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Ghi chú:</strong> {diagnosis.notes}
            </div>
          )}
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
            {diagnosis.main_image_url ? (
              <div className="flex justify-center">
                <Image
                  src={diagnosis.main_image_url}
                  alt="Ảnh mắt"
                  className="rounded-lg border"
                  style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
                  placeholder={
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CameraOutlined className="text-2xl text-gray-400" />
                    </div>
                  }
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CameraOutlined className="text-4xl mb-2" />
                <p>Không có ảnh mắt</p>
              </div>
            )}
          </TabPane>
        </Tabs>

        {/* Ghi chú của bác sĩ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú của bác sĩ
            <span className="text-red-500 ml-1">*</span>
            <span className="text-xs text-gray-500 ml-2">
              (Bắt buộc khi đánh dấu không chính xác)
            </span>
          </label>
          <TextArea
            rows={3}
            placeholder="Nhập ghi chú của bạn về chẩn đoán này..."
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Chữ ký điện tử */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Chữ ký xác nhận
              <span className="text-red-500 ml-1">*</span>
            </label>
            {signatureFile && (
              <Button size="small" danger icon={<ClearOutlined />} onClick={handleRemoveSignature}>
                Xóa chữ ký
              </Button>
            )}
          </div>

          {signatureFile ? (
            <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckOutlined className="text-green-600" />
                <span className="text-sm font-medium text-green-700">Đã ký xác nhận</span>
              </div>
              <img
                src={signaturePreview}
                alt="Chữ ký"
                className="border border-gray-200 rounded bg-white w-full"
                style={{ maxHeight: "120px", objectFit: "contain" }}
              />
            </div>
          ) : (
            <div>
              {showSignaturePad ? (
                <SignaturePad onSave={handleSaveSignature} width={700} height={150} />
              ) : (
                <Button
                  type="dashed"
                  icon={<EditOutlined />}
                  onClick={() => setShowSignaturePad(true)}
                  block
                  size="large"
                  className="h-24"
                >
                  Click để ký xác nhận
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AIDiagnosisDetailModal;
