import React from "react";
import { Button, Col, Form, Input, Layout, Row } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../modules/auth/hooks/mutations/use-login.mutation";
import logo from "../../assets/logo.jpg";

const { Content } = Layout;

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      setLoading(true);
      const tokens = data?.data;

      if (!tokens?.access_token) {
        toast.error("Login thất bại: Không nhận được token.");
        return;
      }

      toast.success("Đăng nhập thành công!");
      setLoading(false);
      navigate("/");
    },
    onError: (error: any) => {
      setLoading(false);

      toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
    },
  });

  const handleLogin = (values: { username: string; password: string }) => {
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
            <img src={logo} alt="Login Illustration" style={{ maxWidth: "80%", height: "auto" }} />
          </Col>

          <Col xs={24} md={12} style={{ padding: "40px" }}>
            <h2 className="text-center mb-4 text-3xl font-semibold">Đăng nhập tài khoản</h2>

            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
              >
                <Input placeholder="Nhập tài khoản" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
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
