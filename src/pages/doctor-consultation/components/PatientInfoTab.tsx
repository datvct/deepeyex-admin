// src/pages/doctor-consultation/components/PatientInfoTab.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, Row, Col, Form, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Appointment } from "../../../modules/appointments/types/appointment";
import { getGenderLabel } from "../../../shares/utils/helper";
import { SpecialtyLabel } from "../../../modules/doctors/enums/specialty";
import { Attachment } from "../../../modules/medical-records/types/medical-record";
import ExistingAttachments from "./ExistingAttachments";

interface PatientInfoTabProps {
  appointment: Appointment;
  diagnosisForm: any;
  medicalRecordAction: "create" | "update";
  attachmentFileList: any[];
  existingAttachments?: Attachment[];
  onUploadChange: (info: any) => void;
}

const PatientInfoTab: React.FC<PatientInfoTabProps> = ({
  appointment,
  diagnosisForm,
  medicalRecordAction,
  attachmentFileList,
  existingAttachments,
  onUploadChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div>
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.fullName")}
              </label>
              <p className="text-gray-800">{appointment.patient.full_name}</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.gender")}
              </label>
              <p className="text-gray-800">{getGenderLabel(appointment.patient.gender)}</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.dob")}
              </label>
              <p className="text-gray-800">{dayjs(appointment.patient.dob).format("DD/MM/YYYY")}</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.phone")}
              </label>
              <p className="text-gray-800">{appointment.patient.phone}</p>
            </div>
          </Col>
          <Col span={24}>
            <div>
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.address")}
              </label>
              <p className="text-gray-800">{appointment.patient.address}</p>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title={t("medicalRecord.patientInfoTab.appointmentInfo")}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div>
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.doctor")}
              </label>
              <p className="text-gray-800">{appointment.doctor.full_name}</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.specialty")}
              </label>
              <p className="text-gray-800">{SpecialtyLabel[appointment.doctor.specialty]}</p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.examinationTime")}
              </label>
              <p className="text-gray-800">
                {appointment.time_slots[0]?.start_time
                  ? new Date(appointment.time_slots[0].start_time).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : ""}{" "}
                -{" "}
                {appointment.time_slots[0]?.end_time
                  ? new Date(appointment.time_slots[0].end_time).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold">
                {t("medicalRecord.patientInfoTab.status")}
              </label>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  appointment.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : appointment.status === "CONFIRMED"
                    ? "bg-green-100 text-green-800"
                    : appointment.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {t(`doctorConsultation.statusLabels.${appointment.status}`)}
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      <Card
        title={
          <div className="flex items-center justify-between">
            <span>{t("medicalRecord.patientInfoTab.diagnosis")}</span>
            {medicalRecordAction === "update" && (
              <span className="text-sm font-normal text-orange-600">
                {t("medicalRecord.patientInfoTab.updatingRecord")}
              </span>
            )}
          </div>
        }
        className="border-l-4 border-l-blue-500"
      >
        <Form form={diagnosisForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="diagnosis"
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    {t("medicalRecord.patientInfoTab.diagnosisLabel")}{" "}
                    <span className="text-red-500">
                      {t("medicalRecord.patientInfoTab.diagnosisRequired")}
                    </span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: t("medicalRecord.patientInfoTab.diagnosisRequiredMessage"),
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={t("medicalRecord.patientInfoTab.diagnosisPlaceholder")}
                />
              </Form.Item>
            </Col>

            {/* Hiển thị attachments có sẵn */}
            {existingAttachments && existingAttachments.length > 0 && (
              <Col span={24}>
                <ExistingAttachments attachments={existingAttachments} />
              </Col>
            )}

            <Col span={24}>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  {existingAttachments && existingAttachments.length > 0
                    ? t("medicalRecord.patientInfoTab.addNewAttachment")
                    : t("medicalRecord.patientInfoTab.attachFile")}
                </label>
                <Upload
                  listType="picture-card"
                  fileList={attachmentFileList}
                  onChange={onUploadChange}
                  maxCount={5}
                  beforeUpload={() => false}
                  className="mt-2"
                >
                  {attachmentFileList.length < 5 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>{t("medicalRecord.patientInfoTab.upload")}</div>
                    </div>
                  )}
                </Upload>
                <p className="text-xs text-gray-500 mt-1">
                  {t("medicalRecord.patientInfoTab.maxFiles")}
                </p>
              </div>
            </Col>
            <Col span={24}>
              <Form.Item
                name="notes"
                label={
                  <span className="text-sm font-semibold text-gray-700">
                    {t("medicalRecord.patientInfoTab.additionalNotes")}
                  </span>
                }
              >
                <Input.TextArea
                  rows={3}
                  placeholder={t("medicalRecord.patientInfoTab.additionalNotesPlaceholder")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default PatientInfoTab;
