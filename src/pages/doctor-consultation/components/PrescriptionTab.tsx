// src/pages/doctor-consultation/components/PrescriptionTab.tsx
import React, { useState } from "react";
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
  const [customTimes, setCustomTimes] = useState<dayjs.Dayjs[]>([]);

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
      custom_times: customTimes.map((time) => time.format("HH:mm")),
    };
    onAddPrescription(formattedValues);
    setCustomTimes([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Hiển thị toa thuốc có sẵn */}
      {existingPrescriptions && existingPrescriptions.length > 0 && (
        <ExistingPrescriptions prescriptions={existingPrescriptions} />
      )}

      <Card title="Thêm toa thuốc mới">
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="drug_name"
                label="Tên thuốc"
                rules={[{ required: true, message: "Vui lòng nhập tên thuốc" }]}
              >
                <Input placeholder="Nhập tên thuốc" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dosage"
                label="Liều lượng"
                rules={[{ required: true, message: "Vui lòng nhập liều lượng" }]}
              >
                <Input placeholder="Ví dụ: 500mg" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="frequency"
                label="Tần suất"
                rules={[{ required: true, message: "Vui lòng nhập tần suất" }]}
              >
                <Input placeholder="Ví dụ: 3 lần/ngày" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Thời gian dùng (số ngày)"
                rules={[{ required: true, message: "Vui lòng nhập thời gian dùng" }]}
              >
                <Input placeholder="Ví dụ: 7" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="notes" label="Ghi chú">
                <Input placeholder="Ghi chú thêm (tùy chọn)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    <ClockCircleOutlined className="mr-1" />
                    Giờ uống thuốc (nhắc nhở bệnh nhân)
                  </label>
                  <Button
                    type="dashed"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddTime}
                  >
                    Thêm giờ uống
                  </Button>
                </div>
                {customTimes.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {customTimes.map((time, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <TimePicker
                          value={time}
                          format="HH:mm"
                          onChange={(t) => handleTimeChange(t, index)}
                          placeholder="Chọn giờ"
                          className="flex-1"
                        />
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={() => handleRemoveTime(index)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">
                      Bấm "Thêm giờ uống" để thiết lập lịch nhắc nhở cho bệnh nhân
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Ví dụ: 08:00, 12:00, 18:00 (uống 3 lần/ngày)
                    </p>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<MedicineBoxOutlined />} block>
              Thêm toa thuốc
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {prescriptions.length > 0 && (
        <Card title="Danh sách toa thuốc">
          <div className="space-y-3">
            {prescriptions.map((prescription, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{prescription.drug_name}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">Liều lượng:</span> {prescription.dosage}
                      </div>
                      <div>
                        <span className="text-gray-600">Tần suất:</span> {prescription.frequency}
                      </div>
                      <div>
                        <span className="text-gray-600">Thời gian:</span> {prescription.duration}{" "}
                        ngày
                      </div>
                      {prescription.custom_times && prescription.custom_times.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Giờ uống:</span>{" "}
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
                          <span className="text-gray-600">Ghi chú:</span> {prescription.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="text" danger onClick={() => onRemovePrescription(index)}>
                    Xóa
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
