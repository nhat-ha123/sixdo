"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface IProps {
  showModalCreate: boolean;
  setShowModalCreate: (value: boolean) => void;
}
function CreateModal(props: IProps) {
  const { showModalCreate, setShowModalCreate } = props;
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [prioritize, setPrioritize] = useState<number>(1);

  const handleSubmit = () => {
    if (!code) {
      toast.error("Vui lòng nhập mã!");
      return;
    }
    if (!name) {
      toast.error("Vui lòng nhập tên!");
      return;
    }
    if (!prioritize) {
      toast.error("Vui lòng nhập ưu tiên!");
      return;
    }

    fetch("https://sixdo-api.ssw.vn/api/store-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, name, prioritize }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          toast.success("Thêm thành công!");
          handleCloseModal();
          mutate("https://sixdo-api.ssw.vn/api/store-category");
        }
      });
  };

  const handleCloseModal = () => {
    setCode("");
    setName("");
    setPrioritize(1);
    setShowModalCreate(false);
  };
  return (
    <>
      <Modal
        show={showModalCreate}
        onHide={() => handleCloseModal()}
        keyboard={false}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thên loại cửa hàng</Modal.Title>
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
          <Button variant="primary" onClick={() => handleSubmit()}> Lưu </Button>
        </Modal.Footer>
      </Modal >
    </>
  );
}

export default CreateModal;
