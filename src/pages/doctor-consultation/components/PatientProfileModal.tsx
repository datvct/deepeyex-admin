import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Tabs, Spin } from "antd";
import { UserOutlined, ExperimentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Appointment } from "../../../modules/appointments/types/appointment";
import { useCheckMedicalRecordQuery } from "../../../modules/medical-records/hooks/queries/use-check-medical-record.query";
import { MedicalRecord } from "../../../modules/medical-records/types/medical-record";
import { useCreateFullRecordMutation } from "../../../modules/medical-records/hooks/mutations/use-create-full-record.mutation";
import { useCompleteRecordMutation } from "../../../modules/medical-records/hooks/mutations/use-complete-record.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../shares/enums/queryKey";
import { toast } from "react-toastify";
import PatientInfoTab from "./PatientInfoTab";
import PrescriptionTab from "./PrescriptionTab";
import AIDiagnosisTab from "./AIDiagnosisTab";

const { TabPane } = Tabs;

interface PatientProfileModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (recordId: string, appointment: Appointment) => void;
}

interface PrescriptionForm {
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  custom_times?: string[];
  notes?: string;
  status?: string;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSaveSuccess,
}) => {
  const [prescriptionForm] = Form.useForm<PrescriptionForm>();
  const [diagnosisForm] = Form.useForm();
  const [prescriptions, setPrescriptions] = useState<PrescriptionForm[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const queryClient = useQueryClient();

  // State để lưu action và record data
  const [medicalRecordAction, setMedicalRecordAction] = useState<"create" | "update">("create");
  const [existingRecord, setExistingRecord] = useState<MedicalRecord | null>(null);
  const [attachmentFileList, setAttachmentFileList] = useState<any[]>([]);

  // Check medical record when modal opens
  const {
    data: checkData,
    isLoading: isCheckingRecord,
    refetch: refetchCheck,
  } = useCheckMedicalRecordQuery(appointment.appointment_id || "", {
    enabled: !!appointment.appointment_id && isOpen,
  });

  // Mutation: Create Full Record
  const createFullRecordMutation = useCreateFullRecordMutation({
    onSuccess: (response) => {
      toast.success("Tạo hồ sơ bệnh án thành công!");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.MedicalRecord] });
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Appointment] });

      // Data trực tiếp là record, không có wrapper
      const recordId = response?.data?.record_id || "";
      console.log("✅ Record ID saved:", recordId);

      // Đóng modal và callback lên parent
      onClose();
      onSaveSuccess?.(recordId, appointment);
    },
    onError: (error) => {
      toast.error("Lỗi tạo hồ sơ: " + error.message);
    },
  });

  // Mutation: Complete Record (Update)
  const completeRecordMutation = useCompleteRecordMutation({
    onSuccess: (response) => {
      toast.success("Cập nhật hồ sơ bệnh án thành công!");
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.MedicalRecord] });
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Appointment] });

      // Data trực tiếp là record, không có wrapper
      const recordId = response?.data?.record_id || existingRecord?.record_id || "";
      console.log("✅ Record ID saved (update):", recordId);

      // Đóng modal và callback lên parent
      onClose();
      onSaveSuccess?.(recordId, appointment);
    },
    onError: (error) => {
      toast.error("Lỗi cập nhật hồ sơ: " + error.message);
    },
  });

  // Cập nhật state khi có data từ API
  useEffect(() => {
    if (checkData?.data) {
      setMedicalRecordAction(checkData.data.action);

      if (checkData.data.action === "update" && checkData.data.record) {
        const record = checkData.data.record as MedicalRecord;
        setExistingRecord(record);

        // Set form values với data có sẵn
        diagnosisForm.setFieldsValue({
          diagnosis: record.diagnosis,
          notes: record.notes,
        });

        // Set existing attachments to file list
        if (record.attachments && record.attachments.length > 0) {
          const existingFiles = record.attachments.map((att, index) => ({
            uid: att.id || `${index}`,
            name: `attachment-${index + 1}`,
            status: "done",
            url: att.file_url,
            type: att.file_type,
          }));
          setAttachmentFileList(existingFiles as any);
        }

        // Set existing prescriptions
        if (record.prescriptions && record.prescriptions.length > 0) {
          // Note: Backend prescriptions structure khác với form prescription
          // Có thể cần convert hoặc hiển thị riêng
        }
      } else {
        setExistingRecord(null);
        diagnosisForm.resetFields();
        setAttachmentFileList([]);
        setPrescriptions([]);
      }
    }
  }, [checkData, diagnosisForm]);

  const handleAddPrescription = (values: PrescriptionForm) => {
    setPrescriptions([...prescriptions, values]);
    prescriptionForm.resetFields();
    toast.success("Đã thêm toa thuốc");
  };

  const handleRemovePrescription = (index: number) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
    toast.success("Đã xóa toa thuốc");
  };

  const handleSaveConsultation = async () => {
    try {
      // Validate diagnosis form
      const diagnosisValues = await diagnosisForm.validateFields();

      // Prepare attachments
      const attachments = attachmentFileList
        .filter((file) => file.originFileObj) // Chỉ lấy file mới upload
        .map((file) => ({
          file: file.originFileObj as File,
          file_type: file.type || "OTHER",
        }));

      // Prepare prescription data
      const prescriptionData =
        prescriptions.length > 0
          ? {
              patient_id: appointment.patient_id,
              source: "DOCTOR",
              description: "Toa thuốc từ bác sĩ",
              items: prescriptions.map((p) => ({
                drug_name: p.drug_name,
                dosage: p.dosage,
                frequency: p.frequency,
                duration_days: parseInt(p.duration) || 7,
                notes: p.notes,
                start_date: new Date().toISOString(), // Full datetime format
                custom_times: p.custom_times || [],
              })),
              status: "APPROVED",
            }
          : undefined;

      if (medicalRecordAction === "create") {
        // Create Full Record
        createFullRecordMutation.mutate({
          patient_id: appointment.patient_id,
          doctor_id: appointment.doctor_id || "",
          appointment_id: appointment.appointment_id || "",
          diagnosis: diagnosisValues.diagnosis,
          notes: diagnosisValues.notes,
          attachments: attachments.length > 0 ? attachments : undefined,
          prescription: prescriptionData,
        });
      } else {
        // Complete Record (Update)
        completeRecordMutation.mutate({
          record_id: existingRecord?.record_id || "",
          diagnosis: diagnosisValues.diagnosis,
          notes: diagnosisValues.notes,
          attachments: attachments.length > 0 ? attachments : undefined,
          prescription: prescriptionData,
        });
      }
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error("Vui lòng điền đầy đủ thông tin chẩn đoán");
    }
  };

  const handleUploadChange = ({ fileList }: any) => {
    setAttachmentFileList(fileList);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-600" />
          <span>Hồ sơ bệnh nhân - {appointment.patient.full_name}</span>
          {medicalRecordAction === "update" && existingRecord && (
            <span className="text-sm text-green-600 ml-2">(Đã có hồ sơ)</span>
          )}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          disabled={createFullRecordMutation.isPending || completeRecordMutation.isPending}
        >
          Đóng
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSaveConsultation}
          loading={
            isCheckingRecord ||
            createFullRecordMutation.isPending ||
            completeRecordMutation.isPending
          }
        >
          {medicalRecordAction === "update" ? "Cập nhật hồ sơ" : "Lưu thông tin khám bệnh"}
        </Button>,
      ]}
    >
      {isCheckingRecord ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip="Đang kiểm tra hồ sơ bệnh án..." />
        </div>
      ) : (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Thông tin bệnh nhân" key="profile">
            <PatientInfoTab
              appointment={appointment}
              diagnosisForm={diagnosisForm}
              medicalRecordAction={medicalRecordAction}
              attachmentFileList={attachmentFileList}
              existingAttachments={existingRecord?.attachments}
              onUploadChange={handleUploadChange}
            />
          </TabPane>

          <TabPane tab="Toa thuốc" key="prescription">
            <PrescriptionTab
              form={prescriptionForm}
              prescriptions={prescriptions}
              existingPrescriptions={existingRecord?.prescriptions}
              onAddPrescription={handleAddPrescription}
              onRemovePrescription={handleRemovePrescription}
            />
          </TabPane>

          {existingRecord &&
            existingRecord.ai_diagnoses &&
            existingRecord.ai_diagnoses.length > 0 && (
              <TabPane
                tab={
                  <span>
                    <ExperimentOutlined /> Chẩn đoán AI
                  </span>
                }
                key="ai-diagnosis"
              >
                <AIDiagnosisTab aiDiagnoses={existingRecord.ai_diagnoses} />
              </TabPane>
            )}
        </Tabs>
      )}
    </Modal>
  );
};

export default PatientProfileModal;
