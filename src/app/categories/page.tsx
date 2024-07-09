"use client";

import useSWR, { mutate } from "swr";
import { Space, Table, Button } from "antd";
import CreateModal from "./create.modal";
import EditModal from "./edit.modal";
import ViewModal from "./view.modal";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const PageConponent = () => {
  const [category, setCategory] = useState<any>(null);
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [showModalView, setShowModalView] = useState<boolean>(false);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://sixdo-api.ssw.vn/api/store-category",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  if (error) {
    return <div>Lỗi</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDeleteCategory = async (id: any) => {
    await fetch(`https://sixdo-api.ssw.vn/api/store-category/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json, text/plain, */* ",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success) {
          toast.success('Xoá dữ liệu thành công!');
        } else {
          toast.error('Xoá dữ liệu không thành công!');
        }
      });
  };
  function submit(id: any) {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn chắc chắn muốn xoá dữ liệu này!!',
      buttons: [
        {
          label: 'Xác nhận',
          className: 'btn btn-success btn-sm btn-ms',
          onClick: () => handleDeleteCategory(id)
        },
        {
          label: 'Không',
        }
      ]
    });
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã Loại cửa hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên Loại cửa hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ưu tiên",
      dataIndex: "prioritize",
      key: "prioritize",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" onClick={() => {
            setCategory(record);
            setShowModalView(true);
          }}
          >
            <i className="bi bi-eye-fill"></i>
            Xem
          </Button>
          <Button type="primary" onClick={() => {
            setCategory(record);
            setShowModalEdit(true);
          }}
          >
            <i className="bi bi-pencil"></i> Chỉnh sửa </Button>
          <Button type="primary" danger className="btn btn-danger btn-sm btn-ms" onClick={() => submit(record.id)} >
            <i className="bi bi-trash"></i>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  if (error) {
    return <div>Lỗi</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const items = data?.result?.items;
  console.log("data items", items);

  return (
    <>
      <div className="container-xxl my-md-4 bd-layout">
        <div
          className="mb-3 align-items-md-center"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h4>Quản lý loại cửa hàng</h4>
          <Button type="primary" onClick={() => setShowModalCreate(true)}>
            <i className="bi bi-plus-circle"></i>
            Thêm
          </Button>
        </div>
        <Table
          dataSource={items}
          columns={columns}
          rowKey="id"
          bordered
          rowClassName={(record, index) =>
            index % 2 === 0 ? "even-row" : "odd-row"
          }
          showHeader
          showSorterTooltip={false}
          pagination={{ pageSize: 5 }}
          className="custom-table"
        />
        <CreateModal
          showModalCreate={showModalCreate}
          setShowModalCreate={setShowModalCreate}
        />
        <EditModal
          showModalEdit={showModalEdit}
          setShowModalEdit={setShowModalEdit}
          category={category}
          setCategory={setCategory}
        />
        <ViewModal
          showModalView={showModalView}
          setShowModalView={setShowModalView}
          category={category}
          setCategory={setCategory}
        />
      </div>
    </>
  );
};

export default PageConponent;
