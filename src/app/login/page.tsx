"use client";
import { Button, Divider, Form, Input, message, notification } from "antd";
import { useDispatch } from "react-redux";
import { callLogin } from "../../config/api";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import { useState } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";

const PageComponent = () => {
  const [userNameOrPhoneNumber, setUserNameOrPhoneNumber] =
    useState<string>("");
  const [password, setPassword] = useState<string>("");

  const deviceTypeId = 1;
  const subMIT = () => {
    fetch("https://sixdo-api.ssw.vn/api/token", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userNameOrPhoneNumber, password, deviceTypeId }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          toast.success("login succeed!");
          mutate("https://sixdo-api.ssw.vn/api/token");
        } else {
          toast.error("login error !");
        }
      });
  };

  const onFinish = async (values: any) => {
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");
    // const dispatch = useDispatch();
    const { username, password } = values;
    const res = await callLogin(username, password);
    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      // dispatch(setUserLoginInfo(res.data.user));
      message.success("Đăng nhập tài khoản thành công!");
      window.location.href = callback ? callback : "/";
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  return (
    <div>
      <main>
        <div>
          <section>
            <div>
              <h2>Đăng Nhập</h2>
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
                setUserNameOrPhoneNumber(values.username);
                setPassword(values.password);
                onFinish(values);
                subMIT();
              }}
              autoComplete="off"
            >
              <h2 style={{ textAlign: "center" }}>Đăng Nhập</h2>
              <Form.Item
                labelCol={{ span: 24 }} //cả cột
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                ]}
              >
                <Input
                  value={userNameOrPhoneNumber}
                  onChange={(e) => setUserNameOrPhoneNumber(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }} //cả cột
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: "175px", marginTop: "20px" }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
              <Divider>Hoặc</Divider>
              <p className="text text-normal" style={{ textAlign: "center" }}>
                Chưa có tài khoản ?
                <span>
                  <a href="/register"> Đăng Ký </a>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PageComponent;
