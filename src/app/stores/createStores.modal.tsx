"use client";
import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  notification,
  Row,
  Col,
} from "antd";
import { mutate } from "swr";
import { SmileOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

interface Iprops {
  showModalcreate: boolean;
  setShowModalCreate: (valu: boolean) => void;
}
const CreateStore = (props: Iprops) => {
  const { showModalcreate, setShowModalCreate } = props;
  const [open, setOpen] = useState(false);
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

  const showModal = () => {
    setShowModalCreate(true);
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
    setShowModalCreate(false);
  };

  const handleSubmit = () => {
    if (
      !name ||
      !code ||
      !responsibilityBy ||
      !targetMin ||
      !splitRatio ||
      !area ||
      !storeCategoryId ||
      !level
    ) {
      notification.open({
        message: "Notification  alo ",
        description: "Vui lòng nhập đủ thông tin.",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      setShowModalCreate(true);
      return;
    } else {
      fetch("https://sixdo-api.ssw.vn/api/store", {
        method: "POST",
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
            toast.success("Tạo mới cửa hàng thành công");
            mutate("https://sixdo-api.ssw.vn/api/store");
          } else {
            toast.error("Tạo cửa hàng không thành công");
          }
        });
    }
    // ---------------------

    handleCancel();
    form.resetFields();
  };

  const { Option } = Select;
  const handleSelectChange = (value: string) => {
    setLevel(value); // Cập nhật giá trị khi người dùng chọn
  };

  const handleSelectChangeStore = (value: string) => {
    setStoreCategoryId(value); // Cập nhật giá trị khi người dùng chọn
  };

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        style={{ top: 20, minWidth: "800px", marginTop: "120px" }}
        title="Thêm mới cửa hàng"
        open={showModalcreate}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Xác nhận
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="data_entry_form">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã Cửa hàng"
                rules={[{ required: true, message: "Nhập mã cửa hàng !." }]}
              >
                <Input
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên cửa hàng"
                rules={[{ required: true, message: "Nhập tên cửa hàng !." }]}
              >
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="respon"
                label="Người phụ trách"
                rules={[{ required: true, message: "Nhập người phụ trách !." }]}
              >
                <Input
                  value={responsibilityBy}
                  onChange={(e) => setResponsibilityBy(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="target"
                label="target Min"
                rules={[{ required: true, message: "Nhập target !." }]}
              >
                <Input
                  type="numnber"
                  value={targetMin}
                  onChange={(e) => setTargetMin(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="split"
                label="Tỷ lệ chia hàng"
                rules={[{ required: true, message: "Nhập tỷ lệ !." }]}
              >
                <Input
                  type="number"
                  value={splitRatio}
                  onChange={(e) => setSplitRatio(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="area"
                label="Khu vực"
                rules={[{ required: true, message: "Nhập khu vực!" }]}
              >
                <Input value={area} onChange={(e) => setArea(e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phanloai"
                label="Phân loại"
                rules={[{ required: true, message: "Nhập phân loại !." }]}
              >
                <Select
                  value={storeCategoryId}
                  onChange={handleSelectChangeStore}
                >
                  <Select.Option value="8">DB</Select.Option>
                  <Select.Option value="9">A</Select.Option>
                  <Select.Option value="10">B</Select.Option>
                  <Select.Option value="11">C</Select.Option>
                  <Select.Option value="12">ĐB</Select.Option>
                  {/* <Select.Option value="3">C</Select.Option> */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: "Nhập vô level !." }]}
              >
                <Input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="note" label="Ghi chú">
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateStore;
