// src/pages/doctor-consultation/components/PrescriptionTab.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Form, Input, Button, Row, Col, TimePicker, Tag, Space } from "antd";
import {
  MedicineBoxOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Prescription } from "../../../modules/medical-records/types/medical-record";
import ExistingPrescriptions from "./ExistingPrescriptions";

interface PrescriptionForm {
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  custom_times?: string[];
  notes?: string;
}

interface PrescriptionTabProps {
  form: any;
  prescriptions: PrescriptionForm[];
  existingPrescriptions?: Prescription[];
  onAddPrescription: (values: PrescriptionForm) => void;
  onRemovePrescription: (index: number) => void;
}

const PrescriptionTab: React.FC<PrescriptionTabProps> = ({
  form,
  prescriptions,
  existingPrescriptions,
  onAddPrescription,
  onRemovePrescription,
}) => {
  const { t } = useTranslation();
  const [customTimes, setCustomTimes] = useState<dayjs.Dayjs[]>([]);
  const [frequency, setFrequency] = useState<number>(0);

  // Auto-generate times based on frequency
  const handleFrequencyChange = (value: string) => {
    const freq = parseInt(value) || 0;
    setFrequency(freq);

    // Preset times for frequency 1-3
    const presetTimes: { [key: number]: string[] } = {
      1: ["08:00"],
      2: ["08:00", "18:00"],
      3: ["08:00", "12:00", "18:00"],
    };

    if (freq >= 1 && freq <= 3) {
      // Auto-generate times for frequency 1-3
      const times = presetTimes[freq].map((timeStr) => dayjs(timeStr, "HH:mm"));
      setCustomTimes(times);
    } else if (freq >= 4) {
      // For frequency >= 4, create empty slots for manual input
      const emptyTimes = Array(freq)
        .fill(null)
        .map(() => dayjs("08:00", "HH:mm"));
      setCustomTimes(emptyTimes);
    } else {
      setCustomTimes([]);
    }
  };

  const handleAddTime = () => {
    setCustomTimes([...customTimes, dayjs()]);
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = customTimes.filter((_, i) => i !== index);
    setCustomTimes(newTimes);
  };

  const handleTimeChange = (time: dayjs.Dayjs | null, index: number) => {
    if (time) {
      const newTimes = [...customTimes];
      newTimes[index] = time;
      setCustomTimes(newTimes);
    }
  };

  const handleFinish = (values: any) => {
    const formattedValues = {
      ...values,
      frequency: `${values.frequency}`, // Convert to string
      custom_times: customTimes.map((time) => time.format("HH:mm")),
    };
    onAddPrescription(formattedValues);
    form.resetFields();
    setCustomTimes([]);
    setFrequency(0);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Hiển thị toa thuốc có sẵn */}
      {existingPrescriptions && existingPrescriptions.length > 0 && (
        <ExistingPrescriptions prescriptions={existingPrescriptions} />
      )}

      <Card title={t("medicalRecord.prescriptionTab.addNewTitle")}>
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="drug_name"
                label={t("medicalRecord.prescriptionTab.drugName")}
                rules={[
                  { required: true, message: t("medicalRecord.prescriptionTab.drugNameRequired") },
                ]}
              >
                <Input placeholder={t("medicalRecord.prescriptionTab.drugNamePlaceholder")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dosage"
                label={t("medicalRecord.prescriptionTab.dosage")}
                rules={[
                  { required: true, message: t("medicalRecord.prescriptionTab.dosageRequired") },
                ]}
              >
                <Input placeholder={t("medicalRecord.prescriptionTab.dosagePlaceholder")} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="frequency"
                label={t("medicalRecord.prescriptionTab.frequency")}
                rules={[
                  { required: true, message: t("medicalRecord.prescriptionTab.frequencyRequired") },
                  {
                    pattern: /^[1-9]\d*$/,
                    message: t("medicalRecord.prescriptionTab.frequencyInvalid"),
                  },
                ]}
              >
                <Input
                  placeholder={t("medicalRecord.prescriptionTab.frequencyPlaceholder")}
                  type="number"
                  min={1}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label={t("medicalRecord.prescriptionTab.duration")}
                rules={[
                  { required: true, message: t("medicalRecord.prescriptionTab.durationRequired") },
                ]}
              >
                <Input
                  placeholder={t("medicalRecord.prescriptionTab.durationPlaceholder")}
                  type="number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="notes" label={t("medicalRecord.prescriptionTab.notes")}>
                <Input placeholder={t("medicalRecord.prescriptionTab.notesPlaceholder")} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    <ClockCircleOutlined className="mr-1" />
                    {t("medicalRecord.prescriptionTab.medicationTimes")}
                  </label>
                  {frequency >= 4 && (
                    <Button
                      type="dashed"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={handleAddTime}
                    >
                      {t("medicalRecord.prescriptionTab.addTime")}
                    </Button>
                  )}
                </div>
                {customTimes.length > 0 ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-blue-600 mb-2">
                        {t("medicalRecord.prescriptionTab.timesPerDay")} ({frequency}{" "}
                        {t("medicalRecord.prescriptionTab.timesPerDaySuffix")}):
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {customTimes.map((time, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <TimePicker
                              value={time}
                              format="HH:mm"
                              onChange={(t) => handleTimeChange(t, index)}
                              placeholder={t("medicalRecord.prescriptionTab.selectTime")}
                              className="flex-1"
                            />
                            {frequency >= 4 && (
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={() => handleRemoveTime(index)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">
                      {t("medicalRecord.prescriptionTab.autoSetupHint")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t("medicalRecord.prescriptionTab.autoSetupExample")}
                    </p>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<MedicineBoxOutlined />} block>
              {t("medicalRecord.prescriptionTab.addPrescription")}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {prescriptions.length > 0 && (
        <Card title={t("medicalRecord.prescriptionTab.prescriptionList")}>
          <div className="space-y-3">
            {prescriptions.map((prescription, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{prescription.drug_name}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">{t("medicalRecord.viewModal.dosage")}</span>{" "}
                        {prescription.dosage}
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("medicalRecord.viewModal.frequency")}
                        </span>{" "}
                        {prescription.frequency}{" "}
                        {t("medicalRecord.prescriptionTab.timesPerDaySuffix")}
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("medicalRecord.viewModal.duration")}
                        </span>{" "}
                        {prescription.duration} {t("medicalRecord.viewModal.days")}
                      </div>
                      {prescription.custom_times && prescription.custom_times.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-gray-600">
                            {t("medicalRecord.prescriptionTab.times")}
                          </span>{" "}
                          <Space size={[4, 4]} wrap>
                            {prescription.custom_times.map((time, idx) => (
                              <Tag key={idx} color="blue" icon={<ClockCircleOutlined />}>
                                {time}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                      {prescription.notes && (
                        <div className="col-span-2">
                          <span className="text-gray-600">
                            {t("medicalRecord.viewModal.notes")}
                          </span>{" "}
                          {prescription.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="text" danger onClick={() => onRemovePrescription(index)}>
                    {t("medicalRecord.prescriptionTab.remove")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionTab;
