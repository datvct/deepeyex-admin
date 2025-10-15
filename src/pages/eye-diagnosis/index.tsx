import React, { useState } from "react";
import {
  Upload,
  Button,
  Card,
  message,
  Progress,
  Tag,
  Divider,
  Row,
  Col,
  Space,
  Empty,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { usePredictMutation } from "../../modules/predict/hooks/mutations/use-predict.mutation";
import type { DiagnosisResponse } from "../../modules/predict/types/predict";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: string;
  recommendations: string[];
  alternative_diagnoses: Array<{ label: string; probability: number }>;
}

// Mapping disease labels to Vietnamese
const diseaseLabels: Record<string, string> = {
  amd: "Thoái hóa hoàng điểm (AMD)",
  cataract: "Đục thủy tinh thể",
  diabetic_retinopathy_mild: "Bệnh võng mạc tiểu đường nhẹ",
  diabetic_retinopathy_moderate: "Bệnh võng mạc tiểu đường trung bình",
  diabetic_retinopathy_proliferate: "Bệnh võng mạc tiểu đường tăng sinh",
  diabetic_retinopathy_severe: "Bệnh võng mạc tiểu đường nặng",
  glaucoma: "Tăng nhãn áp (Glaucoma)",
  healthy_eye: "Mắt khỏe mạnh",
  conjunctivitis: "Viêm kết mạc",
  eyelidedema: "Phù mi mắt",
  hordeolum: "Lẹo mắt",
  keratitiswithulcer: "Viêm giác mạc có loét",
  subconjunctival_hemorrhage: "Xuất huyết dưới kết mạc",
};

// Get recommendations based on disease
const getRecommendations = (diseaseLabel: string): string[] => {
  const recommendations: Record<string, string[]> = {
    amd: [
      "Chụp OCT võng mạc",
      "Chụp mạch máu võng mạc (FFA)",
      "Test Amsler grid",
      "Tiêm thuốc chống VEGF",
      "Bổ sung vitamin và khoáng chất",
    ],
    cataract: [
      "Đo thị lực chi tiết",
      "Khám sinh hiển vi",
      "Đánh giá mức độ đục thủy tinh thể",
      "Phẫu thuật thay thủy tinh thể (IOL)",
    ],
    diabetic_retinopathy_proliferate: [
      "Chụp OCT võng mạc khẩn cấp",
      "Chụp mạch máu võng mạc (FFA)",
      "Laser quang đông võng mạc",
      "Tiêm thuốc chống VEGF",
      "Kiểm soát đường huyết nghiêm ngặt",
    ],
    diabetic_retinopathy_severe: [
      "Chụp OCT võng mạc",
      "Chụp mạch máu võng mạc (FFA)",
      "Laser quang đông võng mạc",
      "Kiểm soát đường huyết",
      "Theo dõi định kỳ",
    ],
    glaucoma: [
      "Đo nhãn áp (IOP)",
      "Khám đáy mắt",
      "Đo thị trường (Visual Field)",
      "Chụp OCT",
      "Thuốc nhỏ mắt hạ nhãn áp",
    ],
    conjunctivitis: [
      "Thuốc nhỏ mắt kháng sinh",
      "Vệ sinh mắt sạch sẽ",
      "Tránh dụi mắt",
      "Theo dõi triệu chứng",
    ],
    healthy_eye: ["Duy trì vệ sinh mắt tốt", "Khám định kỳ hàng năm", "Bảo vệ mắt khỏi tia UV"],
  };

  return (
    recommendations[diseaseLabel] || [
      "Khám chuyên khoa mắt",
      "Thực hiện các xét nghiệm cần thiết",
      "Theo dõi định kỳ",
    ]
  );
};

// Get severity based on probability
const getSeverity = (probability: number): string => {
  if (probability >= 0.8) return "Cao";
  if (probability >= 0.5) return "Trung bình";
  return "Thấp";
};

// Map API response to DiagnosisResult
const mapApiResponseToResult = (data: DiagnosisResponse): DiagnosisResult => {
  const topPrediction = data.top1;
  const diseaseName = diseaseLabels[topPrediction.label] || topPrediction.label;

  return {
    disease: diseaseName,
    confidence: Math.round(topPrediction.probability * 100),
    severity: getSeverity(topPrediction.probability),
    recommendations: getRecommendations(topPrediction.label),
    alternative_diagnoses: data.predictions
      .filter((p) => p.label !== topPrediction.label)
      .map((p) => ({
        label: diseaseLabels[p.label] || p.label,
        probability: Math.round(p.probability * 100),
      })),
  };
};

const EyeDiagnosisPage: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  const { mutate, isPending } = usePredictMutation({
    onSuccess: (data: DiagnosisResponse) => {
      const result = mapApiResponseToResult(data);
      setDiagnosisResult(result);
      message.success("Chẩn đoán hoàn tất!");
    },
    onError: (error) => {
      console.error("Chẩn đoán thất bại:", error.message);
      message.error("Chẩn đoán thất bại. Vui lòng thử lại!");
    },
  });

  const handleUploadChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setDiagnosisResult(null);
  };

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleDiagnose = () => {
    if (fileList.length === 0) {
      message.warning("Vui lòng upload ít nhất 1 ảnh mắt");
      return;
    }

    const firstFile = fileList[0];
    if (!firstFile.originFileObj) {
      message.error("File không hợp lệ");
      return;
    }

    // Gọi API predict
    mutate({
      file: firstFile.originFileObj,
      topK: 3,
    });
  };

  const handleReset = () => {
    setFileList([]);
    setDiagnosisResult(null);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    return "#ff4d4f";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Thấp":
        return "green";
      case "Trung bình":
        return "orange";
      case "Cao":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <EyeOutlined className="text-blue-600" />
          Chẩn đoán AI bằng hình ảnh
        </h1>
        <p className="text-gray-600">Upload ảnh mắt để nhận chẩn đoán từ AI</p>
      </div>

      <Row gutter={16}>
        {/* Left side - Upload Section */}
        <Col xs={24} lg={12}>
          <Card title="Upload ảnh mắt" className="mb-4">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={handleBeforeUpload}
              accept="image/*"
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined className="text-2xl mb-2" />
                  <div className="text-sm">Upload ảnh</div>
                </div>
              )}
            </Upload>

            <div className="mt-4 text-sm text-gray-500">
              <p>• Chỉ upload 1 ảnh mắt</p>
              <p>• Định dạng: JPG, PNG, JPEG</p>
              <p>• Kích thước tối đa: 5MB</p>
            </div>

            <Divider />

            <Space>
              <Button
                type="primary"
                icon={<RobotOutlined />}
                onClick={handleDiagnose}
                loading={isPending}
                disabled={fileList.length === 0}
                size="large"
              >
                {isPending ? "Đang chẩn đoán..." : "Chẩn đoán AI"}
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={isPending}>
                Làm mới
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Right side - Result Section */}
        <Col xs={24} lg={12}>
          <Card title="Kết quả chẩn đoán" className="mb-4">
            {isPending ? (
              <div className="text-center py-8">
                <RobotOutlined className="text-6xl text-blue-500 mb-4 animate-pulse" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Đang phân tích ảnh...</h3>
                <p className="text-gray-500">AI đang xử lý và chẩn đoán</p>
                <Progress percent={50} status="active" className="mt-4" />
              </div>
            ) : diagnosisResult ? (
              <div className="space-y-4">
                {/* Disease Name */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-600" />
                    Chẩn đoán
                  </h3>
                  <p className="text-xl font-bold text-gray-800">{diagnosisResult.disease}</p>
                </div>

                {/* Confidence & Severity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Độ tin cậy</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        percent={diagnosisResult.confidence}
                        strokeColor={getConfidenceColor(diagnosisResult.confidence)}
                        size="small"
                        style={{ width: 100 }}
                      />
                      <span className="font-bold">{diagnosisResult.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mức độ nghiêm trọng</p>
                    <Tag color={getSeverityColor(diagnosisResult.severity)} className="text-sm">
                      {diagnosisResult.severity}
                    </Tag>
                  </div>
                </div>

                <Divider />

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Điều trị được đề xuất:</h4>
                  <div className="space-y-2">
                    {diagnosisResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 font-bold">{index + 1}.</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Alternative Diagnoses */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Chẩn đoán thay thế:</h4>
                  <div className="space-y-2">
                    {diagnosisResult.alternative_diagnoses.map((alt, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{alt.label}</span>
                        <Tag color="orange">{alt.probability}%</Tag>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider />

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Kết quả chẩn đoán AI chỉ mang tính chất tham khảo. Vui
                    lòng khám trực tiếp với bác sĩ chuyên khoa để có chẩn đoán chính xác.
                  </p>
                </div>
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Upload ảnh và nhấn 'Chẩn đoán AI' để nhận kết quả"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EyeDiagnosisPage;
