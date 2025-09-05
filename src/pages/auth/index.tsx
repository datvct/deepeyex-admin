import { Button, Col, Form, Input, Layout, Row } from "antd";
import React from "react";
import { toast } from "react-toastify";

const { Content } = Layout;

export default function LoginPage() {
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
              src="../../assets/logo.jpg"
              alt="Login Illustration"
              style={{ maxWidth: "80%", height: "auto" }}
            />
          </Col>

          {/* Bên phải: form login */}
          <Col xs={24} md={12} style={{ padding: "40px" }}>
            <h2 className="text-center mb-4 text-3xl font-semibold">
              Đăng nhập tài khoản
            </h2>
            <Form layout="vertical">
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
                  style={{
                    border: "none",
                    borderRadius: "24px",
                  }}
                  onClick={() => toast.success("Đăng nhập thành công!")}
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
