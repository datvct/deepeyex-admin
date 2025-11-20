import { Alert, Col, Form, Input, Modal, Row, Select, Spin, Upload } from "antd";
import React, { useEffect, useState } from "react";
import CrudTable from "../../shares/components/CrudTable";
import { FilterField } from "../../shares/components/AdvancedFilter";
import {
  useListHospitalsQuery,
  UseListHospitalsQueryParams,
} from "../../modules/hospitals/hooks/queries/use-get-hospitals.query";
import { Hospital } from "../../modules/hospitals/types/hospital";
import { useDeleteHospitalMutation } from "../../modules/hospitals/hooks/mutations/use-delete-hospital.mutation";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../shares/enums/queryKey";
import { useCreateHospitalMutation } from "../../modules/hospitals/hooks/mutations/use-create-hospital.mutation";
import { createHospitalSchema } from "../../modules/hospitals/schemas/createHospital.schema";
import z from "zod";
import { PlusOutlined } from "@ant-design/icons";
import { useUpdateHospitalMutation } from "../../modules/hospitals/hooks/mutations/use-update-hospital.mutation";
import { useTranslation } from "react-i18next";
import { City, Ward } from "../../shares/types/types";
const { Option } = Select;

export default function HospitalsPage() {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [filterParams, setFilterParams] = useState<Record<string, any>>({});

  const { data, isLoading, isError } = useListHospitalsQuery({ filters: filterParams });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    fetch("http://provinces.open-api.vn/api/v2/?depth=2")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // ---- Mutation: Delete
  const deleteHospital = useDeleteHospitalMutation({
    onSuccess: (data) => {
      toast.success(t("hospital.messages.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(t("hospital.messages.deleteError"));
    },
  });

  // ---- Mutation: Create
  const createHospital = useCreateHospitalMutation({
    onSuccess: (data) => {
      toast.success(t("hospital.messages.createSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(t("hospital.messages.createError"));
    },
  });

  // ---- Mutation: Update
  const updateHospital = useUpdateHospitalMutation({
    onSuccess: (data) => {
      toast.success(t("hospital.messages.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.Hospital] });
    },
    onError: (error) => {
      toast.error(t("hospital.messages.updateError"));
    },
  });

  // Load dữ liệu vào state
  useEffect(() => {
    if (data?.data) {
      setHospitals(data.data);
    }
  }, [data]);

  // ---- Thêm mới ----
  const handleAdd = () => {
    setEditingHospital(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ---- Sửa ----
  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    form.setFieldsValue({
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email,
      url_map: hospital.url_map,
      ward: hospital.ward,
      city: hospital.city,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
      logo: hospital.image
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: hospital.image,
            },
          ]
        : [],
    });

    setIsModalOpen(true);
  };

  // ---- Submit form ----
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        logo: values.logo || [],
      };
      const parsed = createHospitalSchema.parse(formattedValues);

      if (editingHospital) {
        updateHospital.mutate({
          hospital_id: editingHospital.hospital_id,
          ...parsed,
        });
      } else {
        createHospital.mutate(parsed);
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      if (err instanceof z.ZodError) {
        form.setFields(
          err.issues.map((e) => ({
            name: e.path.join("."),
            errors: [e.message],
          })),
        );
      }
    }
  };

  // ----- Xóa bệnh viện -----
  const handleDelete = (hospital: Hospital) => {
    deleteHospital.mutate(hospital.hospital_id);
  };

  const handleCityChange = (cityName: string) => {
    const selectedCity = cities.find((city) => city.name === cityName);

    if (selectedCity) {
      setWards(selectedCity.wards);
    } else {
      setWards([]);
    }
  };

  // Filter fields cho Hospital
  const hospitalFilterFields: FilterField[] = [
    {
      name: "name",
      label: t("hospital.filter.name"),
      type: "text",
      placeholder: t("hospital.filter.namePlaceholder"),
      span: 6,
      width: 300,
    },
    {
      name: "address",
      label: t("hospital.filter.address"),
      type: "text",
      placeholder: t("hospital.filter.addressPlaceholder"),
      span: 6,
      width: 300,
    },
    {
      name: "city",
      label: t("hospital.filter.city"),
      type: "select",
      placeholder: t("hospital.filter.cityPlaceholder"),
      span: 4,
      width: 200,
      options: cities.map((city) => ({
        label: city.name,
        value: city.name,
      })),
    },
    {
      name: "ward",
      label: t("hospital.filter.ward"),
      type: "text",
      placeholder: t("hospital.filter.wardPlaceholder"),
      span: 4,
      width: 200,
    },
  ];

  const handleFilter = (filterValues: Record<string, any>) => {
    // Gửi filter params lên API
    setFilterParams(filterValues);
  };

  const handleResetFilter = () => {
    // Reset filter params
    setFilterParams({});
  };

  // ---- Cấu hình cột bảng ----
  const hospitalColumns = [
    { title: t("hospital.columns.id"), dataIndex: "hospital_id", key: "hospital_id", width: "10%" },
    {
      title: t("hospital.form.image"),
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (image: string) =>
        image ? (
          <img src={image} alt="hospital" style={{ width: 50, height: 50, objectFit: "cover" }} />
        ) : (
          "-"
        ),
    },
    { title: t("hospital.form.name"), dataIndex: "name", key: "name", width: "20%" },
    {
      title: t("hospital.form.address"),
      dataIndex: "address",
      key: "address",
      width: "25%",
      render: (address: string, record: Hospital) => {
        const fullAddress = [address, record.ward, record.city].filter(Boolean).join(", ");
        return <span>{fullAddress || "-"}</span>;
      },
    },
    { title: t("hospital.form.phone"), dataIndex: "phone", key: "phone", width: "10%" },
    { title: t("hospital.form.email"), dataIndex: "email", key: "email", width: "15%" },
  ];

  return (
    <>
      {isError && (
        <Alert
          message={t("hospital.messages.loadErrorTitle")}
          description={t("hospital.messages.loadErrorDescription")}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <Spin spinning={isLoading}>
        <CrudTable
          title={t("hospital.title")}
          subtitle={t("hospital.subtitle")}
          rowKey="hospital_id"
          columns={hospitalColumns}
          dataSource={hospitals}
          addButtonText={t("hospital.addButton")}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          useAdvancedFilter={true}
          filterFields={hospitalFilterFields}
          onFilter={handleFilter}
          onResetFilter={handleResetFilter}
        />
      </Spin>

      <Modal
        title={editingHospital ? t("hospital.editTitle") : t("hospital.addTitle")}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        centered
        destroyOnClose
        width={800} // Tăng chiều rộng modal để bố cục 2 cột đẹp hơn
      >
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            {/* Cột trái */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label={t("hospital.form.name")}
                rules={[
                  {
                    required: true,
                    message: t("hospital.form.placeholder.name"),
                  },
                ]}
              >
                <Input placeholder={t("hospital.form.placeholder.name")} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={t("hospital.form.phone")}
                rules={[
                  {
                    pattern: /^[0-9]{8,15}$/,
                    message: t("hospital.form.placeholder.phone"),
                  },
                ]}
              >
                <Input placeholder={t("hospital.form.placeholder.phone")} />
              </Form.Item>
              <Form.Item
                name="email"
                label={t("hospital.form.email")}
                rules={[
                  {
                    type: "email",
                    message: t("hospital.form.placeholder.email"),
                  },
                ]}
              >
                <Input placeholder={t("hospital.form.placeholder.email")} />
              </Form.Item>
              <Form.Item
                name="url_map"
                label={t("hospital.form.url_map")}
                rules={[
                  {
                    required: true,
                    message: t("hospital.form.placeholder.url_map"),
                  },
                ]}
              >
                <Input placeholder={t("hospital.form.placeholder.url_map")} />
              </Form.Item>
              <Form.Item
                name="latitude"
                label={t("hospital.form.latitude")}
                rules={[
                  {
                    required: true,
                    message: t("hospital.form.placeholder.latitude"),
                  },
                  {
                    pattern: /^-?\d+(\.\d+)?$/,
                    message: t("hospital.form.placeholder.latitude"),
                  },
                ]}
              >
                <Input placeholder={t("hospital.form.placeholder.latitude")} />
              </Form.Item>
              <Form.Item
                name="longitude"
                label={t("hospital.form.longitude")}
                rules={[
                  {
                    required: true,
                    message: t("hospital.form.placeholder.longitude"),
                  },
                  {
                    pattern: /^-?\d+(\.\d+)?$/,
                    message: t("hospital.form.placeholder.longitude"),
                  },
                ]}
              >
                <Input placeholder={t("hospital.form.placeholder.longitude")} />
              </Form.Item>{" "}
            </Col>

            {/* Cột phải */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="city"
                label={t("hospital.form.city")}
                rules={[
                  {
                    required: true,
                    message: t("hospital.form.placeholder.city"),
                  },
                ]}
              >
                <Select
                  placeholder={t("hospital.form.placeholder.city")}
                  onChange={handleCityChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {cities.map((city) => (
                    <Option key={city.code} value={city.name}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="ward"
                label={t("hospital.form.ward")}
                rules={[
                  {
                    required: true,
                    message: t("hospital.form.placeholder.ward"),
                  },
                ]}
              >
                <Select
                  placeholder={t("hospital.form.placeholder.ward")}
                  disabled={wards.length === 0}
                  showSearch
                  optionFilterProp="children"
                >
                  {wards.map((ward) => (
                    <Option key={ward.code} value={ward.name}>
                      {ward.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="address" label={t("hospital.form.address")}>
                <Input placeholder={t("hospital.form.placeholder.address")} />
              </Form.Item>

              <Form.Item
                name="logo"
                label={t("hospital.form.image")}
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              >
                <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>{t("hospital.form.image")}</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
