/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Select, Row, Card, Col } from "antd";
import { mutate } from "swr";
import Link from "next/link";
import "./Store.module.css";
import { info } from "sass";
import "@/styles/styles.css";

interface Iprops {
  showModalView: boolean;
  setShowModalView: (valu: boolean) => void;
  blog: any | null;
  setBlog: (valu: any | null) => void;
}

const ViewStore = (props: Iprops) => {
  const [id, setId] = useState<number>(0);
  const { showModalView, setShowModalView, blog, setBlog } = props;
  const [open] = useState(false);
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

  const view = () => {
    useEffect(() => {
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
        if (blog.storeCategoryId === 8) {
          setStoreCategoryId("DB");
        }
        if (blog.storeCategoryId === 9) {
          setStoreCategoryId("A");
        }
        if (blog.storeCategoryId === 10) {
          setStoreCategoryId("B");
        }
        if (blog.storeCategoryId === 11) {
          setStoreCategoryId("C");
        }
      }
    }, [blog]);
  };
  view();

  const showModal = () => {
    setShowModalView(true);
    view();
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
    setShowModalView(false);
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
          mutate("https://sixdo-api.ssw.vn/api/store");
        } else {         
          alert("Error");
        }
      }); 
    handleCancel();
    form.resetFields();
  };

  const { Option } = Select;
  const handleSelectChange = (value: string) => {
    setLevel(value);
  };
  const handleSelectChangedm = (value: string) => {
    setStoreCategoryId(value); 
  };

  return (
    <>      
      <Modal
        title="Chi tiết thông tin cửa hàng"
        style={{ top: 20, minWidth: "800px", marginTop: "120px" }}
        open={showModalView}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Đóng
          </Button>,          
        ]}
      >
        {/*  */}
        <Form
          form={form}
          layout="vertical"
          name="data_entry_form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã CH"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input  value={code} onChange={(e) => setCode(e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên CH"
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
                label="Người phụ tránh"
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
                <Input type='number'
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
                  type='number'
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
              rows={2} 
            />
           
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ViewStore;
