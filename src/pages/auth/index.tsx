import React from "react";
import { Button, Col, Form, Input, Layout, Row } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../modules/auth/hooks/mutations/use-login.mutation";
import { DoctorApi } from "../../modules/doctors/apis/doctorApi";
import { useDispatch } from "react-redux";
import { ROLES } from "../../shares/constants/roles";
const { Content } = Layout;
import { setDoctor } from "../../shares/stores/authSlice";
import { Doctor } from "../../modules/doctors/types/doctor";
import { loadStringeeSdk } from "../../shares/utils/stringee-sdk-loader";
import { connectToStringee } from "../../shares/utils/stringee";
import { CallApi } from "../../modules/call/apis/callApi";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const loginMutation = useLoginMutation({
    onSuccess: async (data) => {
      setLoading(true);
      const tokens = data?.data;

      if (!tokens?.access_token) {
        toast.error("Login thất bại: Không nhận được token.");
        return;
      }
      if (tokens?.role === ROLES.HOSPITAL) {
        const doctor = await DoctorApi.getByUserId(data.data?.user_id || "");
        const payload = {
          doctor: doctor.data,
        };
        dispatch(setDoctor(payload?.doctor ?? ({} as Doctor)));
      }
      if (tokens?.role === ROLES.DOCTOR) {
        const doctor = await DoctorApi.getByUserId(data.data?.user_id || "");
        const payload = {
          doctor: doctor.data,
        };
        dispatch(setDoctor(payload?.doctor ?? ({} as Doctor)));
      }
      if (tokens?.role === ROLES.RECEPTIONIST) {
        const doctor = await DoctorApi.getByUserId(data.data?.user_id || "");
        const payload = {
          doctor: doctor.data,
        };
        dispatch(setDoctor(payload?.doctor ?? ({} as Doctor)));
      }
      const res = await CallApi.getStringeeToken(data.data?.user_id || "");
      const stringeeToken = res.data.token;
      await loadStringeeSdk();
      connectToStringee(stringeeToken);
      toast.success("Đăng nhập thành công!");
      setLoading(false);
      navigate("/");
    },
    onError: (error: any) => {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác!";
      toast.error(errorMessage);

      // Set error cho cả 2 fields
      form.setFields([
        {
          name: "username",
          errors: ["Tài khoản hoặc mật khẩu không chính xác!"],
        },
        {
          name: "password",
          errors: ["Tài khoản hoặc mật khẩu không chính xác!"],
        },
      ]);
    },
  });

  const handleLogin = (values: { username: string; password: string }) => {
    // Clear errors trước khi submit
    form.setFields([
      { name: "username", errors: [] },
      { name: "password", errors: [] },
    ]);
    loginMutation.mutate(values);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ zIndex: 9999 }}
      />
      <Content className="w-full max-w-[70%] p-8 rounded-lg flex items-center justify-center">
        <Row
          justify="center"
          align="middle"
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Col
            xs={0}
            md={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              background: "#fafafa",
            }}
          >
            <img
              src={"/logo.jpg"}
              alt="Login Illustration"
              style={{ maxWidth: "80%", height: "auto" }}
            />
          </Col>

          <Col xs={24} md={12} style={{ padding: "40px" }}>
            <h2 className="text-center mb-4 text-3xl font-semibold">Đăng nhập tài khoản</h2>

            <Form form={form} layout="vertical" onFinish={handleLogin}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
                hasFeedback
              >
                <Input placeholder="Nhập tài khoản" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                hasFeedback
              >
                <Input.Password placeholder="Nhập mật khẩu" size="large" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  style={{
                    border: "none",
                    borderRadius: "24px",
                  }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className="text-center mt-2.5 text-sm">
                <a href="#">Quên mật khẩu</a>
              </div>
            </Form>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
