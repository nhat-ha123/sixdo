"use client";
import Link from "next/link";

import useSWR, { Fetcher } from "swr";
import React from 'react';
import { Card, Space } from 'antd';
import '@/styles/styles.css'

const ViewDetailBlog = ({ params }: { params: { id: string } }) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    `https://sixdo-api.ssw.vn/api/store/${params.id}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (isLoading) {
    return <div>Loading...,,,</div>;
  }
  const items = data?.result;
  // const items = data;
  console.log("data item:  ", items);    
  console.log("data :  ", data); 


  return (
    <div>
      <div className="my-3">
        <Link href={"/stores"} style={{marginLeft:'10%'}}>Về stores</Link>

      </div>
      <div className="centerCard">
      <Card title={`Cửa hàng ${items?.name}`} style={{ width: '50%', textAlign:"center" }}>
        <div >
      <p ><span>Mã cửa hàng:</span> {items?.code}</p>
      <p ><span>Tên cửa hàng:</span> {items?.name}</p>
      <p ><span>Người phụ trách:</span> {items?.responsibilityBy}</p>
      <p ><span>Target Min:</span> {items?.targetMin}</p>
      <p ><span>Tỷ lệ chia:</span> {items?.splitRatio}</p>
      <p ><span>Khu vực:</span> {items?.area}</p>
      <p ><span>Level:</span> {items?.level}</p>
      <p ><span>Ghi chú:</span> {items?.note}</p>
      </div>
    </Card>
      </div>
    </div>
  );
};
export default ViewDetailBlog;