'use client'
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import "./imports.css";
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import

export interface stock {
  id?: number,
  productCode: string,
  productNameEN: string,
  productNameVN: string,
  unit: string,
  w01SIXDO: number,
  total: number,
  totalInternal: number,
  totalTAX: number,
  totalProduction: number,
  totalOther: number,
  wsd: number,
  codeCreatedWhen: any,
  codeCreatedBy: string,
  codeProduct: string,
  codeProduction: string,
  codeColor: string,
  priceOnBarcode: number,
  gender: string,
  type: string,
  group: string,
  productionYear: number,
  season: string,
  size: string,
  materials01: string,
  materials02: string,
  materials03: string,
  materials04: string,
  materials05: string
}

const ImportComponent = () => {

  const [stocks, setStocks] = useState<stock[]>([]);

  const readExcelFile = async (event: any) => {
    const file = event.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });
    let _stocks: stock[] = []
    jsonData.map((item: any, index) => {
      if (index > 0) {
        let _row: stock = {
          productCode: item[1],
          productNameEN: item[2],
          productNameVN: item[3],
          unit: item[4],
          w01SIXDO: item[5],
          total: item[6],
          totalInternal: item[7],
          totalTAX: item[8],
          totalProduction: item[9],
          totalOther: item[10],
          wsd: item[11],
          codeCreatedWhen: Moment((new Date('1899/12/30')).setDate((new Date('1899/12/30')).getDate() + item[12])).format('YYYY-MM-DD'),
          codeCreatedBy: item[13],
          codeProduct: item[14],
          codeProduction: item[15],
          codeColor: item[16],
          priceOnBarcode: item[17],
          gender: item[18],
          type: item[19],
          group: item[20],
          productionYear: item[21],
          season: item[22],
          size: item[23],
          materials01: item[24],
          materials02: item[25],
          materials03: item[26],
          materials04: item[27],
          materials05: item[28]
        }
        _stocks.push(_row)
      }
    })
    setStocks(_stocks);
    console.log(_stocks);
  }

  function importData() {
    if (!stocks || stocks.length == 0) {
      toast.error("Dữ liệu trống!");
      return;
    }
    fetch("https://sixdo-api.ssw.vn/api/warehouse-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stocks),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success) {
          toast.success(res.result);
          setStocks([]);
        } else {
          toast.error('Import dữ liệu không thành công!');
        }
      });
  }


  function submitImport() {
    confirmAlert({
      title: 'Xác nhận',
      message: `Bạn chắn chắn muốn import (${stocks.length}) dữ liệu!!`,
      buttons: [
        {
          label: 'Xác nhận',
          className: 'btn btn-success btn-sm btn-ms',
          onClick: () => importData()
        },
        {
          label: 'Không',
        }
      ]
    });
  };

  function deleteDataStock() {
    fetch("https://sixdo-api.ssw.vn/api/warehouse-stock/ALL", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.success) {
          toast.success('Xoá dữ liệu thành công!');
        } else {
          toast.error('Xoá dữ liệu không thành công!');
        }
      });
  }

  function submit() {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn chắn chắn muốn xoá dữ liệu tồn kho!!',
      buttons: [
        {
          label: 'Xác nhận',
          className: 'btn btn-success btn-sm btn-ms',
          onClick: () => deleteDataStock()
        },
        {
          label: 'Không',
        }
      ]
    });
  };


  //----------------------
  return (
    <>
      <div className='container-fluid my-md-4 bd-layout'>
        <ToastContainer />
        <div className="row margin-bt">
          <div className="col col-2 d-grid">
            <input type="file" id="fileStock" name="fileStock" onChange={readExcelFile}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          </div>
          <div className="col col-1 d-grid">
            <button onClick={submitImport} className="btn btn-success btn-sm btn-ms"><i className="bi bi-arrow-up-square"></i> Import data</button>
          </div>
          <div className="col col-ms-2">
          </div>
          <div className="col col-4">
          </div>
          <div className="col col-1 d-grid">
            <a href="/TemplateStrock.xlsx" download="myTemplateStock" className="btn btn-success btn-sm btn-ms"><i className="bi bi-arrow-down-square"></i> Mẫu data</a>
          </div>
          <div className="col col-2 d-grid">
            <button onClick={submit} className="btn btn-danger btn-sm btn-ms"><i className="bi bi-recycle"></i> Xoá dữ liệu tồn kho</button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="col grid-table">
              <div className="tbl-header">
                <table cellPadding={0} cellSpacing={0} border={0}>
                  <thead>
                    <tr>
                      <th className='cell-prod'>Mã vật tư</th>
                      <th className='cell-prod-name'>Tên vật tư</th>
                      <th className='cell-prod'>Tên vật tư 2</th>
                      <th>Đvt</th>
                      <th>W01 - Kho SIXDO</th>
                      <th>Tổng cộng</th>
                      <th>Tổng kho Nội Bộ</th>
                      <th>Tổng kho Thuế</th>
                      <th>Tổng kho Sản Xuất</th>
                      <th>Tổng kho Khác</th>
                      <th>WSD - WSD</th>
                      <th className='cell-prod'>Ngày sinh mã</th>
                      <th className='cell-prod'>Người sinh mã</th>
                      <th className='cell-prod'>Mã hàng SX</th>
                      <th className='cell-prod'>Mã sản xuất</th>
                      <th className='cell-prod'>Mã màu</th>
                      <th className='cell-prod'>Giá in barcode</th>
                      <th className='cell-prod'>Dòng</th>
                      <th className='cell-prod'>Chủng loại</th>
                      <th className='cell-prod'>Nhóm sản phẩm</th>
                      <th>Năm sản xuất</th>
                      <th>Mùa</th>
                      <th>Size</th>
                      <th>Nhóm vật tư 1</th>
                      <th>Nhóm vật tư 2</th>
                      <th>Nhóm vật tư 3</th>
                      <th>Nhóm vật tư 4</th>
                      <th>Nhóm vật tư 5</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="tbl-content">
                <table cellPadding={0} cellSpacing={0} border={0}>
                  <tbody key={'bodey-content'}>
                    {
                      stocks && stocks.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className='cell-prod'>{item.productCode}</td>
                            <td className='cell-prod-name'>{item.productNameEN}</td>
                            <td className='cell-prod'>{item.productNameVN}</td>
                            <td>{item.unit}</td>
                            <td>{item.w01SIXDO}</td>
                            <td>{item.total}</td>
                            <td>{item.totalInternal}</td>
                            <td>{item.totalTAX}</td>
                            <td>{item.totalProduction}</td>
                            <td>{item.totalOther}</td>
                            <td>{item.wsd}</td>
                            <td className='cell-prod'>{item.codeCreatedWhen}</td>
                            <td className='cell-prod'>{item.codeCreatedBy}</td>
                            <td className='cell-prod'>{item.codeProduct}</td>
                            <td className='cell-prod'>{item.codeProduction}</td>
                            <td className='cell-prod'>{item.codeColor}</td>
                            <td className='cell-prod'>{item.priceOnBarcode}</td>
                            <td className='cell-prod'>{item.gender}</td>
                            <td className='cell-prod'>{item.type}</td>
                            <td className='cell-prod'>{item.group}</td>
                            <td>{item.productionYear}</td>
                            <td>{item.season}</td>
                            <td>{item.size}</td>
                            <td>{item.materials01}</td>
                            <td>{item.materials02}</td>
                            <td>{item.materials03}</td>
                            <td>{item.materials04}</td>
                            <td>{item.materials05}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default ImportComponent;
