import React, { useState } from "react";
import { Button, Card, Tag, message, Spin, Tabs } from "antd";
import { EyeOutlined, RobotOutlined, CameraOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useGetAllAIDiagnosis } from "../../modules/aidiagnosis/hooks/queries/use-get-all-ai-diagnosis.query";
import { useGetApprovedAIDiagnosis } from "../../modules/aidiagnosis/hooks/queries/use-get-approved-ai-diagnosis.query";
import { useVerifyDiagnosisMutation } from "../../modules/aidiagnosis/hooks/mutations/use-verify-diagnosis.mutation";
import { useTrainModelMutation } from "../../modules/aidiagnosis/hooks/mutations/use-train-model.mutation";
import { AIDiagnosis as AIDiagnosisType } from "../../modules/aidiagnosis/types/aidiagnosis";
import AIDiagnosisDetailModal from "./components/AIDiagnosisDetailModal";
import { useSelector } from "react-redux";
import { RootState } from "../../shares/stores";
import { verifyAIResult } from "../../blockchain/verifyAI";

const AIDiagnosisPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<AIDiagnosisType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("pending");

  const { userId, doctor } = useSelector((state: RootState) => state.auth);
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    error: pendingError,
    refetch: refetchPending,
  } = useGetAllAIDiagnosis();
  const {
    data: approvedData,
    isLoading: isApprovedLoading,
    error: approvedError,
    refetch: refetchApproved,
  } = useGetApprovedAIDiagnosis();

  const { mutate: verifyDiagnosis, isPending: isVerifying } = useVerifyDiagnosisMutation({
    onSuccess: () => {
      message.success(t("aiDiagnosis.verifySuccess"));
      setIsDetailModalOpen(false);
      setSelectedDiagnosis(null);
      // Refresh danh sách sau khi xác nhận
      refetchPending();
      refetchApproved();
    },
    onError: (error) => {
      message.error(t("aiDiagnosis.verifyError", { message: error.message }));
    },
  });

  const { mutate: trainModel, isPending: isTraining } = useTrainModelMutation({
    onSuccess: (data) => {
      message.success(t("aiDiagnosis.trainSuccess", { message: data.message }));
    },
    onError: (error) => {
      message.error(t("aiDiagnosis.trainError", { message: error.message }));
    },
  });

  const handleTrainModel = () => {
    trainModel();
  };

  const handleViewDiagnosis = (diagnosis: AIDiagnosisType) => {
    setSelectedDiagnosis(diagnosis);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDiagnosis(null);
  };

  const handleConfirmDiagnosis = async (
    diagnosisId: string,
    isCorrect: boolean,
    notes?: string,
    signature?: File,
  ) => {
    const doctorId = doctor?.doctor_id || userId;

    if (!doctorId) {
      message.error(t("aiDiagnosis.doctorNotFound"));
      return;
    }

    const verifyData = {
      id: diagnosisId,
      doctor_id: doctorId,
      status: isCorrect ? "APPROVED" : "REJECTED",
      notes:
        notes ||
        (isCorrect
          ? t("aiDiagnosis.defaultNotes.approved")
          : t("aiDiagnosis.defaultNotes.rejected")),
      signature: signature,
    };

    try {
      // 1️⃣ Gọi API backend để update result trong database
      await verifyDiagnosis(verifyData);

      // 2️⃣ Chuẩn bị data để ghi blockchain
      const dataHash = diagnosisId; // Bạn có thể hash ảnh hoặc hash JSON tùy ý
      const aiResult = verifyData.status;
      const isConfirmed = isCorrect;

      // 3️⃣ Ghi lên blockchain qua MetaMask
      const txHash = await verifyAIResult(dataHash, aiResult, isConfirmed, doctorId);

      if (txHash) {
        message.success("Ghi blockchain thành công!\nTX: " + txHash);
      }
    } catch (err: any) {
      message.error("Lỗi blockchain: " + err.message);
    }
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "PENDING":
        return "orange";
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    const upperStatus = status.toUpperCase();
    return t(`aiDiagnosis.statusLabels.${upperStatus}`, { defaultValue: status });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "orange";
    return "red";
  };

  const renderDiagnosisList = (diagnoses: AIDiagnosisType[]) => {
    if (diagnoses?.length === 0) {
      return (
        <div className="text-center py-12">
          <RobotOutlined className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">{t("aiDiagnosis.noDiagnosis")}</h3>
          <p className="text-gray-400">{t("aiDiagnosis.noDiagnosisDescription")}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {diagnoses?.map((diagnosis) => {
          const confidencePercent = Math.round(diagnosis.confidence * 100);
          const diseaseName = t(`aiDiagnosis.diseaseLabels.${diagnosis.disease_code}`, {
            defaultValue: diagnosis.disease_code,
          });

          return (
            <Card
              key={diagnosis.id}
              className="hover:shadow-lg transition-shadow"
              actions={[
                <Button
                  key="view"
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDiagnosis(diagnosis)}
                >
                  {t("aiDiagnosis.viewDetails")}
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
                          {t("aiDiagnosis.patientId", { id: diagnosis.patient_id.slice(0, 8) })}
                        </h3>
                        {diagnosis.main_image_url && (
                          <CameraOutlined
                            className="text-green-600 text-sm"
                            title={t("aiDiagnosis.hasImage")}
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {t("aiDiagnosis.code", { code: diagnosis.id.slice(0, 13) })}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-1">
                      {t("aiDiagnosis.aiDiagnosisLabel")}
                    </h4>
                    <p className="text-gray-800 bg-gray-50 p-2 rounded font-medium">
                      {diseaseName}
                    </p>
                  </div>

                  {diagnosis.notes && (
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-700 mb-1">{t("aiDiagnosis.notes")}</h4>
                      <p className="text-sm text-gray-600">{diagnosis.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {t("aiDiagnosis.confidence")}
                      </p>
                      <Tag color={getConfidenceColor(confidencePercent)}>{confidencePercent}%</Tag>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t("aiDiagnosis.status")}</p>
                      <Tag color={getStatusColor(diagnosis.status)}>
                        {getStatusText(diagnosis.status)}
                      </Tag>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t("aiDiagnosis.time")}</p>
                      <p className="text-gray-800">
                        {new Date(diagnosis.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const isLoading = activeTab === "pending" ? isPendingLoading : isApprovedLoading;
  const error = activeTab === "pending" ? pendingError : approvedError;
  const diagnoses = activeTab === "pending" ? pendingData?.data || [] : approvedData?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip={t("aiDiagnosis.loading")} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{t("aiDiagnosis.error", { message: error.message })}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <RobotOutlined className="text-blue-600" />
              {t("aiDiagnosis.title")}
            </h1>
            <p className="text-gray-600">
              {t("aiDiagnosis.subtitle", {
                count:
                  activeTab === "pending"
                    ? pendingData?.data?.length || 0
                    : approvedData?.data?.length || 0,
              })}
            </p>
          </div>
          {activeTab === "approved" && (
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              loading={isTraining}
              onClick={handleTrainModel}
              size="large"
              className="bg-purple-600 hover:bg-purple-700 border-purple-600"
            >
              {t("aiDiagnosis.trainModel")}
            </Button>
          )}
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "pending",
            label: t("aiDiagnosis.tabs.pending"),
            children: renderDiagnosisList(pendingData?.data || []),
          },
          {
            key: "approved",
            label: t("aiDiagnosis.tabs.approved"),
            children: renderDiagnosisList(approvedData?.data || []),
          },
        ]}
      />

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
