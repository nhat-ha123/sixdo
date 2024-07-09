"use client";
import React, { useState } from "react";
import { Table, Button, Space, Pagination } from "antd";
import "@/styles/styles.css";
import useSWR, { mutate } from "swr";
import CreateStore from "./createStores.modal";
import UpdateStore from "./updateStores.modal";
import ViewStore from "./viewStore.modal";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const PageStoresComponent = () => {
  interface column {
    code: string;
    name: string;
    responsibilityBy: string | null;
    targetMin: number;
    splitRatio: number;
    area: string;
    storeCategoryId: number;
    level: number;
    note: string | null;
    id: number;
  }
  //-------------------------

  const [blog, setBlog] = useState<any | null>(null);
  const [showModalcreate, setShowModalCreate] = useState<boolean>(false);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [showModalView, setShowModalView] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(20);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "https://sixdo-api.ssw.vn/api/store?MaxResultCount=100",
    // "http://localhost:8000/tests",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  const items = data?.result?.items;
  // const items = data;

  // --------------------------------------

  // const handleDeleteBlog = (id:number)=>{
  //   if(confirm(`Do you want to de le te this blog have id = ${id}`)){
  //     fetch(`https://sixdo-api.ssw.vn/api/store/${id}`,{
  //       method: 'DELETE',
  //       headers: {
  //         'Accept': "application/json, text/plain, */*",
  //         "Content-Type": "application/json",
  //       },
  //     }).then(res => res.json())
  //     .then(res=>{
  //       if(res){

  //         // làm mới dữ liệu được lưu trữ trong bộ nhớ cache cho URL 'http://localhost:8000/blogs'
  //         mutate('https://sixdo-api.ssw.vn/api/store');
  //       }
  //     });
  //   }
  // }
  const deleteStore = async (id: number) => {
    await fetch(`https://sixdo-api.ssw.vn/api/store/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success) {
          toast.success("Xoá dữ liệu thành công!");
          mutate("https://sixdo-api.ssw.vn/api/store");
        } else {
          toast.error("Xoá dữ liệu không thành công!");
        }
      });
  };

  function submit(id: any) {
    confirmAlert({
      title: "Xác nhận",
      message: `Bạn chắn chắn muốn xoá thông tin cửa hàng này?`,
      buttons: [
        {
          label: "Xác nhận",
          className: "btn btn-success btn-sm btn-ms",
          onClick: () => deleteStore(id),
        },
        {
          label: "Không",
        },
      ],
    });
  }
  const dataSource1 = items.map((item: any, index: any) => ({
    code: item.code,
    name: item.name,
    responsibilityBy: item.responsibilityBy,
    targetMin: item.targetMin,
    splitRatio: item.splitRatio,
    area: item.area,
    level: item.level,
    note: item.note,
    storeCategoryId: item.storeCategoryId,
    storeCategoryName: item.storeCategory.name,
    id: item.id,
  }));

  const columns = [
    {
      title: "STT",
      key: "id",
      // dataIndex: 'id',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Mã CH",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Người phụ trách",
      dataIndex: "responsibilityBy",
      key: "responsibilityBy",
    },
    {
      title: "Target min",
      dataIndex: "stargetMin",
      key: "targetMin",
    },
    {
      title: "Tỷ lệ chia hàng",
      dataIndex: "plitRatio",
      key: "splitRatio",
    },
    {
      title: "Nhóm khu vực",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Phân loại",
      dataIndex: "storeCategory",
      key: "storeCategory",
      render: (text: any) => (
        <span>
          {text === 8 ? "ĐB" : text === 9 ? "A" : text === 10 ? "B" : "C"}
        </span>
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Chức năng",
      key: "funct",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              console.log("data item:  ", items);
              setBlog(record);
              setShowModalView(true);
            }}
          >
            <i className="bi bi-eye-fill"></i>
            Xem
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setBlog(record);
              setShowModalUpdate(true);
            }}
          >
            {" "}
            <i className="bi bi-pencil"></i> Chỉnh sửa
          </Button>

          <Button type="primary" danger onClick={() => submit(record.id)}>
            <i className="bi bi-trash"></i> Xoá
          </Button>
        </Space>
      ),
    },
  ];
  //----------------------
  return (
    <div className="container-xxl my-md-4 bd-layout">
      <ToastContainer />
      <div className="mb-3 align-items-md-center"
        style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>Quản lý cửa hàng</h4>
        <Button
          type="primary"
          onClick={() => setShowModalCreate(true)}
        ><i className="bi bi-plus-circle-fill"></i> Thêm
        </Button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={dataSource1}
          columns={columns}
          rowKey="showcode"
          bordered
          rowClassName={(record, index) =>
            index % 2 === 0 ? "even-row" : "odd-row"
          }
          showHeader
          showSorterTooltip={false}
          className="custom-table"
        />
        <CreateStore
          showModalcreate={showModalcreate}
          setShowModalCreate={setShowModalCreate}
        />
        <UpdateStore
          showModalUpdate={showModalUpdate}
          setShowModalUpdate={setShowModalUpdate}
          blog={blog}
          setBlog={setBlog}
        />
        <ViewStore
          showModalView={showModalView}
          setShowModalView={setShowModalView}
          blog={blog}
          setBlog={setBlog}
        />
      </div>
    </div>
  );
};

export default PageStoresComponent;
