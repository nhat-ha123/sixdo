"use client";

import { useState } from "react";
import { Button, Divider, Form, Input, Select, notification } from "antd";
import { toast } from "react-toastify";
import { mutate } from "swr";

const { Option } = Select;

const RegisterComponent = () => {
  const [name, setName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user"); // Vai trò mặc định là 'user'

  const handleSubmit = async () => {
    if (!name || !emailAddress || !password || !role) {
      notification.open({
        message: "Thông báo",
        description: "Vui lòng nhập đủ thông tin.",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://sixdo-api.ssw.vn/api/account/register",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, emailAddress, password, role }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Đăng ký thành công!");
        mutate("https://sixdo-api.ssw.vn/api/account/register");
        notification.open({
          message: "Thông báo",
          description: "Đăng ký thành công.",
        });
      } else {
        toast.error("Lỗi: " + (data.message || "Xảy ra lỗi không xác định"));
        notification.open({
          message: "Thông báo",
          description: "Đăng ký thất bại.",
        });
      }
    } catch (error) {
      console.error("Gọi API thất bại: ", error);
      toast.error("Gọi API thất bại: ");
    }
  };

  return (
    <div>
      <main>
        <div>
          <section>
            <div>
              <h2>Đăng ký</h2>
              <Divider />
            </div>
            <Form
              name="basic"
              style={{
                maxWidth: "500px",
                width: "100%",
                margin: "0 auto",
                padding: "24px",
                borderRadius: "10px",
                background: "white",
                boxShadow: "5px 5px 5px 5px #aaa",
                border: "1px solid black",
              }}
              onFinish={(values) => {
                setName(values.name);
                setEmailAddress(values.emailAddress);
                setPassword(values.password);
                setRole(values.role);
                handleSubmit();
              }}
              autoComplete="off"
            >
              <h2 style={{ textAlign: "center" }}>Đăng ký</h2>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên"
                name="name"
                rules={[
                  { required: true, message: "Tên không được để trống!" },
                ]}
              >
                <Input
                  placeholder="Nhập tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Email"
                name="emailAddress"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  placeholder="Nhập email của bạn"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password
                  placeholder="Nhập từ 6 kí tự trở lên (gồm viết hoa, viết thường và số)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Vai trò"
                name="role"
                rules={[
                  { required: true, message: "Vai trò không được để trống!" },
                ]}
              >
                <Select
                  placeholder="Chọn vai trò của bạn"
                  value={role}
                  onChange={(value) => setRole(value)}
                >
                  <Option value="user">Người dùng</Option>
                  <Option value="admin">Quản trị viên</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: "175px", marginTop: "20px" }}
                >
                  Đăng Ký
                </Button>
              </Form.Item>
              <Divider>Hoặc</Divider>
              <p className="text text-normal" style={{ textAlign: "center" }}>
                Chưa có tài khoản?
                <span>
                  <a href="/login"> Đăng nhập </a>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterComponent;
