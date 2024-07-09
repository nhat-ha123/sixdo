'use client'
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./splits.css";
import { ToastContainer } from "react-toastify";

export interface storeCategory {
    code: string,
    creationTime?: any,
    creatorUserId?: number,
    deleterUserId?: any,
    deletionTime?: any,
    id: number,
    isDeleted: boolean,
    lastModificationTime?: any,
    lastModifierUserId?: any,
    name: string,
    prioritize: number,
}

export interface store {
    area: string,
    code: string,
    id: number,
    level: number,
    name: string,
    note?: string,
    responsibilityBy: string,
    splitRatio: number,
    storeCategory: storeCategory,
    storeCategoryId: number,
    targetMin: number,
}

export interface stock {
    productCode: string,
    productNameEN: string,
    productNameVN: string,
    unit: string,
    w01SIXDO: number,
    total: number,
    totalSplit: number,
    totalPersent: number,
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
    materials05: string,
    id: number,
    cols: col[],
}

export interface col {
    value: number,
    plus: number,
    minus: number,
    store: store
}

const PageConponent = () => {
    const [count, setCount] = useState<number>(0);
    const [min, setMin] = useState<string>('0');
    const [max, setMax] = useState<string>('0');
    const [adjust, setAdjust] = useState<string>('2');
    const [stores, setStores] = useState<store[]>([]);
    const [stocks, setStocks] = useState<stock[]>([]);
    useEffect(() => {
        LoadData();
    }, [])
    const LoadData = async () => {
        //
        await fetch("https://sixdo-api.ssw.vn/api/store?SkipCount=0&MaxResultCount=500", {
            method: "GET",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            }
        }).then(async (res: any) => res.json())
            .then(async (res: any) => {
                if (res) {
                    let _stores = res.result.items;
                    setStores(_stores);
                    //
                    await fetch("https://sixdo-api.ssw.vn/api/warehouse-stock?SkipCount=0&MaxResultCount=60000", {
                        method: "GET",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json",
                        }
                    }).then(async (res: any) => res.json())
                        .then(async (res: any) => {
                            if (res) {
                                let _stocks = res.result.items;
                                setStocks(_stocks);
                            } else console.log("error:  ", stocks);
                        });
                } else console.log("error:  ", stocks);
            });
    }

    //
    async function Split() {
        stores.sort((a, b) => a.storeCategory.prioritize - b.storeCategory.prioritize || a.level - b.level);
        if (stocks && stocks.length > 0 && stocks && stocks.length > 0) {
            await stocks.map(async (rowProd, index) => {
                rowProd.cols = [];
                if (!rowProd.cols) rowProd.cols = [];
                rowProd.totalSplit = 0;
                rowProd.totalPersent = 0;
                let cols: col[] = []
                await stores.map(async (colStore: any) => {
                    let cel: col = {
                        value: Math.round(rowProd.w01SIXDO * colStore.splitRatio / 100),
                        minus: 0,
                        plus: 0,
                        store: colStore
                    }
                    cols.push(cel)
                    rowProd.totalSplit += cel.value;
                    rowProd.totalPersent += colStore.splitRatio;
                })
                rowProd.cols = cols;
                handleSetCount()
            });
        }
    }

    function handleSetCount() {
        setCount(pre => (pre + 1))
    }

    function reSplit() {
        if (stocks && stocks.length > 0 && stores && stores.length > 0) {
            stocks.map((_row, index) => {
                let checkStock = _row.w01SIXDO - _row.totalSplit
                if (checkStock > 0) {//max
                    _row.cols.map(_col => {
                        let checkMax = Number(max) - (_col.value)
                        if (checkMax > 0) {
                            checkStock = _row.w01SIXDO - _row.totalSplit
                            if (checkStock > Number(adjust) && checkMax >= Number(adjust)) {
                                _col.plus += Number(adjust);
                                _col.value += Number(adjust);
                                _row.totalSplit += Number(adjust)
                            } else if (checkStock > Number(adjust) && checkMax < Number(adjust)) {
                                _col.plus += checkMax;
                                _col.value += checkMax;
                                _row.totalSplit += checkMax
                            } else if (checkStock <= Number(adjust) && checkMax < checkStock) {
                                _col.plus += checkMax;
                                _col.value += checkMax;
                                _row.totalSplit += checkMax
                            } else {
                                _col.plus += checkStock;
                                _col.value += checkStock;
                                _row.totalSplit += checkStock
                                return;
                            }
                        }
                    });
                } else if (checkStock < 0) {//min
                    let lengthCol = _row.cols.length;
                    _row.cols.map((_colOld, indexCol) => {
                        let _indexCol = lengthCol - indexCol - 1;
                        let checkMin = (_row.cols[_indexCol].value - Number(min))
                        if (checkMin > 0) {
                            let totalUnStock = (_row.w01SIXDO - _row.totalSplit) * -1;
                            if (totalUnStock > Number(adjust) && checkMin >= Number(adjust)) {
                                _row.cols[_indexCol].minus += Number(adjust);
                                _row.cols[_indexCol].value -= Number(adjust);
                                _row.totalSplit -= Number(adjust)
                            } else if (totalUnStock > Number(adjust) && checkMin < Number(adjust)) {
                                _row.cols[_indexCol].minus += checkMin;
                                _row.cols[_indexCol].value -= checkMin;
                                _row.totalSplit -= checkMin
                            } else if (totalUnStock <= Number(adjust) && checkMin <= totalUnStock) {
                                _row.cols[_indexCol].minus += checkMin;
                                _row.cols[_indexCol].value -= checkMin;
                                _row.totalSplit -= checkMin
                            } else {
                                _row.cols[_indexCol].minus += totalUnStock;
                                _row.cols[_indexCol].value -= totalUnStock;
                                _row.totalSplit -= totalUnStock
                                return;
                            }
                        }
                    });
                }
                //
                console.log(`table re stocks ${index} `, stocks)
                handleSetCount()
            })
        }
    }

    const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMin(e.target.value);
    };

    const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMax(e.target.value);
    };

    const handleChangeAdjust = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdjust(e.target.value);
    };

    const fileName = "Export_CH";
    function downloadXLS() {
        //
        const colStore = "T: " + stores.length;
        const xlsExportObj: any = {
            sheet1: [
                {
                    "Mã CH": "STT",
                    "Mã CH 1": "",
                    [colStore]: "",
                    "SR": "",
                    "": ""
                },
                {
                    "Mã CH": "NHÓM CỬA HÀNG",
                    "Mã CH 1": "",
                    [colStore]: "",
                    "SR": "",
                    "": ""
                },
                {
                    "Mã CH": "MÃ SP",
                    "Mã CH 1": "SIZE",
                    [colStore]: "SL TT SX",
                    "SR": "SL TT XUẤT RA SR",
                    "": "HOÀN THIỆN"
                },
                {
                    "Mã CH": "",
                    "Mã CH 1": "",
                    [colStore]: "Tồn",
                    "SR": "Tổng",
                    "": (Math.round(stores.reduce((a, b) => a + b.splitRatio, 0) * 100) / 100) + '%'
                }
            ]
        };
        stores && stores.map((item: store, index) => {
            xlsExportObj.sheet1[0][item.code] = index + 1;
            xlsExportObj.sheet1[1][item.code] = item.storeCategory.name;
            xlsExportObj.sheet1[2][item.code] = item.name;
            xlsExportObj.sheet1[3][item.code] = item.splitRatio + '%';
        })
        stocks && stocks?.map((item: stock, index) => {
            let rowData: any = {
                "Mã CH": item.productCode,
                "Mã CH 1": item.size,
                [colStore]: item.w01SIXDO,
                "SR": item.cols?.reduce((a, b) => a + b.value, 0),
                "": item.w01SIXDO - item.cols?.reduce((a, b) => a + b.value, 0)
            }
            item.cols?.map((itemCol: col, indexCol) => {
                rowData[stores[indexCol].code] = itemCol.value;
            })
            xlsExportObj.sheet1.push(rowData);
        });
        //
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        for (const key of Object.getOwnPropertyNames(xlsExportObj)) {
            let ws: XLSX.WorkSheet;
            if (key === "marksSummary") {
                ws = XLSX.utils.json_to_sheet(xlsExportObj[key]);
            } else {
                ws = XLSX.utils.json_to_sheet(xlsExportObj[key]);

                const merge = [
                    { s: { r: 0, c: 1 }, e: { r: 0, c: 0 } },
                    { s: { r: 2, c: 4 }, e: { r: 2, c: 0 } },
                ];
                ws["!merges"] = merge;
                //
                var wscols = [
                    { wch: 22 },
                    { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }
                ];
                stores.map(() => {
                    wscols.push({ wch: 5 })
                })
                ws['!cols'] = wscols;
                //
                // ws["!margins"]={left:12,right:0.25,top:0.75,bottom:0.75,header:0.3,footer:0.3}
            }
            XLSX.utils.book_append_sheet(wb, ws, key);
        }
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
    return (
        <>
            <div className="container-fluid my-md-4 bd-layout">
                <ToastContainer />
                <div className="row margin-bt">
                    <div className="col col-1 d-grid">
                        <button className="btn btn-primary btn-sm btn-ms" onClick={a => Split()}><i className="bi bi-arrow-up-right-square"></i> Chia hàng</button>
                    </div>
                    <div className="col col-1">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text" id="basic-addon1">Min</span>
                            <input name='min' value={min} onChange={handleChangeMin}
                                type="number" className="form-control form-control-sm" id="min" placeholder="Nhập min" />
                        </div>
                    </div>
                    <div className="col col-1 ">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text" id="basic-addon1">Max</span>
                            <input name='max' value={max} onChange={handleChangeMax}
                                type="number" className="form-control form-control-sm" id="max" placeholder="Nhập max" />
                        </div>
                    </div>
                    <div className="col col-ms-2">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text" id="basic-addon1">Điều chỉnh +/-</span>
                            <input name='adjust' value={adjust} onChange={handleChangeAdjust}
                                type="number" className="form-control form-control-sm" id="adjust" placeholder="Nhập điều chỉnh" />
                        </div>
                    </div>
                    <div className="col col-1 d-grid">
                        <button className="btn btn-warning btn-sm btn-ms" onClick={reSplit}><i className="bi bi-arrow-repeat"></i> Điều chỉnh</button>
                    </div>
                    <div className="col col-5">
                    </div>
                    <div className="col col-1 d-grid">
                        <button className="btn btn-success btn-sm btn-ms" onClick={downloadXLS}><i className="bi bi-arrow-bar-down"></i> Export</button> <span className="hide">{count}</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col col-3 grid-table none-pading-r">
                        <div className="tbl-header">
                            <table className="fix" cellPadding={0} cellSpacing={0} border={0}>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>Mã CH</th>
                                        <th>{stores?.length | 0}</th>
                                        <th>SR</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                    <tr>
                                        <th className="cell-prod">STT</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={5}>NHÓM CỬA HÀNG</th>
                                    </tr>
                                    <tr className="h-small">
                                        <th className="cell-prod">Mã SP</th>
                                        <th>Size</th>
                                        <th>SL TT SX</th>
                                        <th>SL TT xuất ra SR</th>
                                        <th>HOÀN THIỆN</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div id="leftContainer" className="tbl-content leftContainer  none-pading-l  none-pading-r">
                            <table className="fix" cellPadding={0} cellSpacing={0} border={0}>
                                <tbody key={'bodey-content'}>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td>0.0%</td>
                                        <td>Tồn</td>
                                        <td>Tổng</td>
                                        <td className="green cell-percent">{Math.round(stores.reduce((a, b) => a + b.splitRatio, 0) * 100) / 100}%</td>
                                    </tr>
                                    {stocks && stocks?.map((item: stock, index) =>
                                    (<tr key={`tr_row_${index}`}>
                                        <td className="cell-prod">{item.productCode}</td>
                                        <td>{item.size}</td>
                                        <td>{item.w01SIXDO}</td>
                                        <td>{(item.cols ? item.cols.reduce((a, b) => a + b.value, 0) : 0)}</td>
                                        <td className={item.w01SIXDO - item.cols?.reduce((a, b) => a + b.value, 0) > 0 ? 'blue cell-percent' :
                                            (item.w01SIXDO - item.cols?.reduce((a, b) => a + b.value, 0) < 0 ? 'red cell-percent' : 'green cell-percent')}>
                                            {item.w01SIXDO - (item.cols ? item.cols.reduce((a, b) => a + b.value, 0) : 0)}
                                        </td>
                                    </tr>)
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col col-9 grid-table  none-pading-l">
                        <div  id="headerContainer" className="tbl-header headerContainer  none-pading-l none-pading-r">
                            <table cellPadding={0} cellSpacing={0} border={0}>
                                <thead>
                                    <tr>
                                        {stores && stores.map((item: store) => {
                                            return (<th key={`code_store_${item.id}`}>{item.code}</th>)
                                        })
                                        }
                                    </tr>
                                    <tr>
                                        {stores && stores.map((item: store, index) => {
                                            return (<th key={`no_${item.id}`}>{index + 1}</th>)
                                        })
                                        }
                                    </tr>
                                    <tr>
                                        {stores && stores.map((item: store, index) => {
                                            return (<th className={item.storeCategory.prioritize == 1 ? 'c1' :
                                                (item.storeCategory.prioritize == 2 ? 'c2' :
                                                    (item.storeCategory.prioritize == 3 ? 'c3' :
                                                        (item.storeCategory.prioritize == 4 ? 'c4' : 'c4')))}
                                                key={`group_${item.id}`}>{item.storeCategory.name}</th>)
                                        })
                                        }
                                    </tr>
                                    <tr className="h-small">
                                        {
                                            stores && stores.map((item: store, index) => (<th key={`name_${item.id}`}>{item.name}</th>))
                                        }
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div id="rightContainer" className="tbl-content rightContainer none-pading-l none-pading-r">
                            <table cellPadding={0} cellSpacing={0} border={0}>
                                <tbody key={'bodey-content'}>
                                    <tr>
                                        {stores && stores.map((item: store, index) => {
                                            return (<td key={`ps_${item.id}`}>{Math.round(item.splitRatio * 100) / 100}%</td>)
                                        })
                                        }
                                    </tr>
                                    {stocks && stocks?.map((item: stock, index) =>
                                    (<tr key={`tr_row_${index}`}>
                                        {
                                            item.cols?.map((itemCol: col, indexCol) => {
                                                return <td className={itemCol.plus > 0 ? 'blue' : (itemCol.minus > 0 ? 'red' : '')}
                                                    title={itemCol.plus > 0 ? `+${itemCol.plus}` : (itemCol.minus > 0 ? `-${itemCol.minus}` : '')}
                                                    key={`cel_${item.productCode}_${item.id}_${indexCol}`} >{(itemCol.value)}</td>
                                            })
                                        }
                                    </tr>)
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <script type="text/javascript" src="/assets/js/scroll.js" />
        </>
    )
}

export default PageConponent;