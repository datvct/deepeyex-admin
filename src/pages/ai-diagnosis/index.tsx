import React, { useState } from "react";
import { Button, Card, Tag, message, Spin } from "antd";
import { EyeOutlined, RobotOutlined, CameraOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useGetAllAIDiagnosis } from "../../modules/aidiagnosis/hooks/queries/use-get-all-ai-diagnosis.query";
import { useVerifyDiagnosisMutation } from "../../modules/aidiagnosis/hooks/mutations/use-verify-diagnosis.mutation";
import { AIDiagnosis as AIDiagnosisType } from "../../modules/aidiagnosis/types/aidiagnosis";
import AIDiagnosisDetailModal from "./components/AIDiagnosisDetailModal";
import { useSelector } from "react-redux";
import { RootState } from "../../shares/stores";

const AIDiagnosisPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<AIDiagnosisType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { userId, doctor } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, error, refetch } = useGetAllAIDiagnosis();

  const { mutate: verifyDiagnosis, isPending: isVerifying } = useVerifyDiagnosisMutation({
    onSuccess: () => {
      message.success(t("aiDiagnosis.verifySuccess"));
      setIsDetailModalOpen(false);
      setSelectedDiagnosis(null);
      // Refresh danh sách sau khi xác nhận
      refetch();
    },
    onError: (error) => {
      message.error(t("aiDiagnosis.verifyError", { message: error.message }));
    },
  });

  const handleViewDiagnosis = (diagnosis: AIDiagnosisType) => {
    setSelectedDiagnosis(diagnosis);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDiagnosis(null);
  };

  const handleConfirmDiagnosis = (
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

    verifyDiagnosis(verifyData);
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

  const diagnoses = data?.data || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <RobotOutlined className="text-blue-600" />
          {t("aiDiagnosis.title")}
        </h1>
        <p className="text-gray-600">{t("aiDiagnosis.subtitle", { count: diagnoses.length })}</p>
      </div>

      {diagnoses?.length === 0 ? (
        <div className="text-center py-12">
          <RobotOutlined className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">{t("aiDiagnosis.noDiagnosis")}</h3>
          <p className="text-gray-400">{t("aiDiagnosis.noDiagnosisDescription")}</p>
        </div>
      ) : (
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
                        <Tag color={getConfidenceColor(confidencePercent)}>
                          {confidencePercent}%
                        </Tag>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {t("aiDiagnosis.status")}
                        </p>
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
