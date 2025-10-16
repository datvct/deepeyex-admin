import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Tabs,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import { Appointment } from "../../../modules/appointments/types/appointment";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { TabPane } = Tabs;

interface PatientProfileModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

interface PrescriptionForm {
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

interface FollowUpForm {
  follow_up_date: dayjs.Dayjs | null;
  reason: string;
  notes?: string;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const [prescriptionForm] = Form.useForm<PrescriptionForm>();
  const [followUpForm] = Form.useForm<FollowUpForm>();
  const [prescriptions, setPrescriptions] = useState<PrescriptionForm[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  const handleAddPrescription = (values: PrescriptionForm) => {
    setPrescriptions([...prescriptions, values]);
    prescriptionForm.resetFields();
    message.success("Đã thêm toa thuốc");
  };

  const handleRemovePrescription = (index: number) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
    message.success("Đã xóa toa thuốc");
  };

  const handleScheduleFollowUp = (values: FollowUpForm) => {
    // Mock data cho hẹn tái khám
    const followUpData = {
      follow_up_id: `followup_${Date.now()}`,
      appointment_id: appointment.appointment_id,
      follow_up_date: values.follow_up_date?.format("YYYY-MM-DD"),
      reason: values.reason,
      notes: values.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Hẹn tái khám:", followUpData);
    message.success("Đã hẹn tái khám thành công");
    followUpForm.resetFields();
  };

  const handleSaveConsultation = () => {
    const consultationData = {
      appointment_id: appointment.appointment_id,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      prescriptions,
      consultation_date: new Date().toISOString(),
      // Có thể thêm các thông tin khác như chẩn đoán, ghi chú khám bệnh
    };
    console.log("Lưu thông tin khám bệnh:", consultationData);
    message.success("Đã lưu thông tin khám bệnh");
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-600" />
          <span>Hồ sơ bệnh nhân - {appointment.patient.full_name}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveConsultation}>
          Lưu thông tin khám bệnh
        </Button>,
      ]}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Thông tin bệnh nhân" key="profile">
          <div className="space-y-4">
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                    <p className="text-gray-800">{appointment.patient.full_name}</p>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Giới tính</label>
                    <p className="text-gray-800">{appointment.patient.gender}</p>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                    <p className="text-gray-800">{appointment.patient.dob}</p>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                    <p className="text-gray-800">{appointment.patient.phone}</p>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                    <p className="text-gray-800">{appointment.patient.address}</p>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Thông tin lịch khám">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bác sĩ</label>
                    <p className="text-gray-800">{appointment.doctor.full_name}</p>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Chuyên khoa</label>
                    <p className="text-gray-800">{appointment.specialty}</p>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Thời gian khám</label>
                    <p className="text-gray-800">
                      {appointment.time_slots[0]?.start_time} -{" "}
                      {appointment.time_slots[0]?.end_time}
                    </p>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                    <p className="text-gray-800">{appointment.status}</p>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </TabPane>

        <TabPane tab="Toa thuốc" key="prescription">
          <div className="space-y-4">
            <Card title="Thêm toa thuốc">
              <Form form={prescriptionForm} onFinish={handleAddPrescription} layout="vertical">
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
                      label="Thời gian dùng"
                      rules={[{ required: true, message: "Vui lòng nhập thời gian dùng" }]}
                    >
                      <Input placeholder="Ví dụ: 7 ngày" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="notes" label="Ghi chú">
                      <Input placeholder="Ghi chú thêm (tùy chọn)" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<MedicineBoxOutlined />}>
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
                              <span className="text-gray-600">Liều lượng:</span>{" "}
                              {prescription.dosage}
                            </div>
                            <div>
                              <span className="text-gray-600">Tần suất:</span>{" "}
                              {prescription.frequency}
                            </div>
                            <div>
                              <span className="text-gray-600">Thời gian:</span>{" "}
                              {prescription.duration}
                            </div>
                            {prescription.notes && (
                              <div>
                                <span className="text-gray-600">Ghi chú:</span> {prescription.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button type="text" danger onClick={() => handleRemovePrescription(index)}>
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </TabPane>

        <TabPane tab="Hẹn tái khám" key="followup">
          <Card>
            <Form form={followUpForm} onFinish={handleScheduleFollowUp} layout="vertical">
              <Form.Item
                name="follow_up_date"
                label="Ngày tái khám"
                rules={[{ required: true, message: "Vui lòng chọn ngày tái khám" }]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Chọn ngày tái khám"
                  disabledDate={(current) => current && current < dayjs().startOf("day")}
                />
              </Form.Item>

              <Form.Item
                name="reason"
                label="Lý do tái khám"
                rules={[{ required: true, message: "Vui lòng nhập lý do tái khám" }]}
              >
                <TextArea rows={4} placeholder="Nhập lý do tái khám..." />
              </Form.Item>

              <Form.Item name="notes" label="Ghi chú (tùy chọn)">
                <TextArea rows={3} placeholder="Nhập ghi chú thêm (nếu có)..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<CalendarOutlined />}>
                  Hẹn tái khám
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default PatientProfileModal;
