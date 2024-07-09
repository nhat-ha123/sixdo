/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Select, Row, Col } from "antd";
import { mutate } from "swr";
import { toast } from "react-toastify";

interface Iprops {
  showModalUpdate: boolean;
  setShowModalUpdate: (valu: boolean) => void;
  blog: any | null;
  setBlog: (valu: any | null) => void;
}

const UpdateStore = (props: Iprops) => {
  const [id, setId] = useState<number>(0);
  const { showModalUpdate, blog, setShowModalUpdate, setBlog } = props;
  const [form] = Form.useForm();
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [responsibilityBy, setResponsibilityBy] = useState<string>("");
  const [targetMin, setTargetMin] = useState<any>("");
  const [splitRatio, setSplitRatio] = useState<any>("");
  const [area, setArea] = useState<string>("");
  const [storeCategoryId, setStoreCategoryId] = useState<any>("");
  const [level, setLevel] = useState<any>("");
  const [note, setNote] = useState<string>("");

  const upda = () => {
    if (blog && blog.id) {
      setId(blog.id);
      setCode(blog.code);
      setName(blog.name);
      setResponsibilityBy(blog.responsibilityBy);
      setTargetMin(blog.targetMin);
      setSplitRatio(blog.splitRatio);
      setArea(blog.area);
      setStoreCategoryId(blog.storeCategoryId);
      setLevel(blog.level);
      setNote(blog.note);
      // alert(storeCategoryId)
      // if (blog.storeCategoryId === 8) {
      //   setStoreCategoryId("DB");
      // }
      // if (blog.storeCategoryId === 9) {
      //   setStoreCategoryId("A");
      // }
      // if (blog.storeCategoryId === 10) {
      //   setStoreCategoryId("B");
      // }
      // if (blog.storeCategoryId === 11) {
      //   setStoreCategoryId("C");
      // }
    }
  };

  useEffect(() => {
    upda();
  }, [blog]);

  const showModal = () => {
    setShowModalUpdate(true);
    upda();
  };

  const handleCancel = () => {
    form.resetFields();
    setCode("");
    setName("");
    setResponsibilityBy("");
    setTargetMin("");
    setSplitRatio("");
    setArea("");
    setStoreCategoryId("");
    setLevel("");
    setNote("");
    setBlog(null);
    setShowModalUpdate(false);
  };

  const handleSubmit = () => {
    // ------------------
    fetch(`https://sixdo-api.ssw.vn/api/store/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        name,
        responsibilityBy,
        targetMin,
        splitRatio,
        area,
        storeCategoryId,
        level,
        note,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          handleCancel();
          toast.success('Câp nhật dữ liệu thành công');
          //  alert("success")
          mutate("https://sixdo-api.ssw.vn/api/store");
        } else {
          // else cho co chu co chay ddau
          toast.error('Lấy dữ liệu lỗi');
        }
      });
    // ---------------------

    // handleCancel();
    // form.resetFields();
  };

  const { Option } = Select;
  const handleSelectChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Chỉ giữ lại các ký tự số
    setSplitRatio(numericValue);
    setLevel(value); // Cập nhật giá trị khi người dùng chọn
  };

  const handleTargetMinChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, ""); // Chỉ giữ lại các ký tự số
    setTargetMin(numericValue);
  };

  const handleSelectChangedm = (value: string) => {
    setStoreCategoryId(value); // Cập nhật giá trị khi người dùng chọn
  };

  return (
    <>
      <Modal
        title="Chỉnh sửa thông tin cửa hàng"
        //
        style={{ top: 20, minWidth: "800px", marginTop: "120px" }}
        open={showModalUpdate}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Đóng
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Chỉnh sửa
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="data_entry_form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã cửa hàng"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input value={code} onChange={(e) => setCode(e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên cửa hàng"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Người phụ trách"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  value={responsibilityBy}
                  onChange={(e) => setResponsibilityBy(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="targetMin"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  type="number"
                  value={targetMin}
                  onChange={(e) => setTargetMin(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tỷ lệ chia hàng"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  value={splitRatio}
                  onChange={(e) => setSplitRatio(e.target.value)}
                  type="number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nhóm khu vực"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input value={area} onChange={(e) => setArea(e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phân loại"
                rules={[
                  { required: true, message: "Please select your role!" },
                ]}
              >
                <Select value={storeCategoryId} onChange={handleSelectChangedm}>
                  <Select.Option value="8">ĐB</Select.Option>
                  <Select.Option value="9">A</Select.Option>
                  <Select.Option value="10">B</Select.Option>
                  <Select.Option value="11">C</Select.Option>

                  {/* <Select.Option value="3">C</Select.Option> */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="level"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Ghi chú">
            <Input.TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2} // Điều chỉnh số hàng hiển thị theo nhu cầu của bạn
            />
            {/* <Input value={note} onChange={(e) => setNote(e.target.value)} /> */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateStore;
