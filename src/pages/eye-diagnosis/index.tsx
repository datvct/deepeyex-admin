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
import { useTranslation } from "react-i18next";
import type { UploadFile, UploadProps } from "antd";
import { usePredictMutation } from "../../modules/predict/hooks/mutations/use-predict.mutation";
import type { DiagnosisResponse } from "../../modules/predict/types/predict";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: string;
  alternative_diagnoses: Array<{ label: string; probability: number }>;
}

// Map API response to DiagnosisResult
const mapApiResponseToResult = (data: DiagnosisResponse, t: any): DiagnosisResult => {
  const topPrediction = data.top1;
  const diseaseName = t(`eyeDiagnosis.diseaseLabels.${topPrediction.label}`, {
    defaultValue: topPrediction.label,
  });

  // Get severity based on probability
  const getSeverity = (probability: number): string => {
    if (probability >= 0.8) return t("eyeDiagnosis.severity.high");
    if (probability >= 0.5) return t("eyeDiagnosis.severity.medium");
    return t("eyeDiagnosis.severity.low");
  };

  return {
    disease: diseaseName,
    confidence: Math.round(topPrediction.probability * 100),
    severity: getSeverity(topPrediction.probability),
    alternative_diagnoses: data.predictions
      .filter((p) => p.label !== topPrediction.label)
      .map((p) => ({
        label: t(`eyeDiagnosis.diseaseLabels.${p.label}`, { defaultValue: p.label }),
        probability: Math.round(p.probability * 100),
      })),
  };
};

const EyeDiagnosisPage: React.FC = () => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  const { mutate, isPending } = usePredictMutation({
    onSuccess: (data: DiagnosisResponse) => {
      const result = mapApiResponseToResult(data, t);
      setDiagnosisResult(result);
      message.success(t("eyeDiagnosis.messages.success"));
    },
    onError: (error) => {
      console.error("Chẩn đoán thất bại:", error.message);
      message.error(t("eyeDiagnosis.messages.error"));
    },
  });

  const handleUploadChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setDiagnosisResult(null);
  };

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error(t("eyeDiagnosis.messages.imageOnly"));
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error(t("eyeDiagnosis.messages.maxSize"));
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleDiagnose = () => {
    if (fileList.length === 0) {
      message.warning(t("eyeDiagnosis.messages.noImage"));
      return;
    }

    const firstFile = fileList[0];
    if (!firstFile.originFileObj) {
      message.error(t("eyeDiagnosis.messages.invalidFile"));
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
    if (severity === t("eyeDiagnosis.severity.low")) return "green";
    if (severity === t("eyeDiagnosis.severity.medium")) return "orange";
    if (severity === t("eyeDiagnosis.severity.high")) return "red";
    return "default";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <EyeOutlined className="text-blue-600" />
          {t("eyeDiagnosis.title")}
        </h1>
        <p className="text-gray-600">{t("eyeDiagnosis.subtitle")}</p>
      </div>

      <Row gutter={16}>
        {/* Left side - Upload Section */}
        <Col xs={24} lg={12}>
          <Card title={t("eyeDiagnosis.uploadCard.title")} className="mb-4">
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
                  <div className="text-sm">{t("eyeDiagnosis.uploadCard.uploadButton")}</div>
                </div>
              )}
            </Upload>

            <div className="mt-4 text-sm text-gray-500">
              <p>{t("eyeDiagnosis.uploadCard.instructions.singleImage")}</p>
              <p>{t("eyeDiagnosis.uploadCard.instructions.formats")}</p>
              <p>{t("eyeDiagnosis.uploadCard.instructions.maxSize")}</p>
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
                {isPending
                  ? t("eyeDiagnosis.uploadCard.diagnosing")
                  : t("eyeDiagnosis.uploadCard.diagnoseButton")}
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={isPending}>
                {t("eyeDiagnosis.uploadCard.resetButton")}
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Right side - Result Section */}
        <Col xs={24} lg={12}>
          <Card title={t("eyeDiagnosis.resultCard.title")} className="mb-4">
            {isPending ? (
              <div className="text-center py-8">
                <RobotOutlined className="text-6xl text-blue-500 mb-4 animate-pulse" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {t("eyeDiagnosis.resultCard.analyzing")}
                </h3>
                <p className="text-gray-500">{t("eyeDiagnosis.resultCard.processing")}</p>
                <Progress percent={50} status="active" className="mt-4" />
              </div>
            ) : diagnosisResult ? (
              <div className="space-y-4">
                {/* Disease Name */}
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-600" />
                    {t("eyeDiagnosis.resultCard.diagnosisLabel")}
                  </h3>
                  <p className="text-xl font-bold text-gray-800">{diagnosisResult.disease}</p>
                </div>

                {/* Confidence & Severity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {t("eyeDiagnosis.resultCard.confidence")}
                    </p>
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
                    <p className="text-sm text-gray-600 mb-1">
                      {t("eyeDiagnosis.resultCard.severity")}
                    </p>
                    <Tag color={getSeverityColor(diagnosisResult.severity)} className="text-sm">
                      {diagnosisResult.severity}
                    </Tag>
                  </div>
                </div>

                <Divider />

                {/* Alternative Diagnoses */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {t("eyeDiagnosis.resultCard.alternativeDiagnoses")}
                  </h4>
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

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    <strong>{t("eyeDiagnosis.resultCard.note")}</strong>{" "}
                    {t("eyeDiagnosis.resultCard.noteText")}
                  </p>
                </div>
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("eyeDiagnosis.resultCard.emptyDescription")}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EyeDiagnosisPage;
