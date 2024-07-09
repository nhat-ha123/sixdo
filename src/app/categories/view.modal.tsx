"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { StoreCategory } from "@/types/backend";
import { Col, Row } from "antd";

interface IProps {
  showModalView: boolean;
  setShowModalView: (value: boolean) => void;
  category: StoreCategory | null;
  setCategory: (value: StoreCategory | null) => void;
}

function ViewModal(props: IProps) {
  const { showModalView, setShowModalView, category, setCategory } = props;

  const [id, setId] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [prioritize, setPrioritize] = useState<number>(1);

  useEffect(() => {
    if (category && category.id) {
      setId(category.id);
      setCode(category.code);
      setName(category.name);
      setPrioritize(category.prioritize);
    }
  }, [category]);

  const handleSubmit = () => {
    if (!code) {
      toast.error("Mã Loại cửa hàng trống! Vui lòng nhập.");
      return;
    }
    if (!name) {
      toast.error("Tên Loại cửa hàng trống! Vui lòng nhập.");
      return;
    }
    if (!prioritize) {
      toast.error("Ưu tiên trống! Vui lòng nhập.");
      return;
    }

    fetch(`https://sixdo-api.ssw.vn/api/store-category/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json , text/plain, */*",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ code, name, prioritize }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          toast.success("Chỉnh sửa thành công!...");
          handleCloseModal();
          mutate("https://sixdo-api.ssw.vn/api/store-category");
        }
      });
  };

  const handleCloseModal = () => {
    setCode("");
    setName("");
    setPrioritize(1);
    setCategory(null); // Reset data
    setShowModalView(false);
  };
  return (
    <>
      <Modal
        show={showModalView}
        onHide={() => handleCloseModal()}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin loại cửa hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Mã loại cửa hàng</Form.Label>
                  <Form.Control type="text" placeholder="..." value={code} onChange={(e) => setCode(e.target.value)} />
                </Form.Group>
              </Col>
              <Col span={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên loại cửa hàng</Form.Label>
                  <Form.Control type="text" placeholder="..." value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Ưu tiên</Form.Label>
              <Form.Control type="number" placeholder="..." value={prioritize} onChange={(e) => setPrioritize(Number(e.target.value))} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModal()}> Đóng </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewModal;
