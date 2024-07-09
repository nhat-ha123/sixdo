'use client'
import Link from 'next/link';
import React from 'react';

const HomeComponent = () => {


  //----------------------
  return (
    <>
      <div className="container-xxl my-md-4 bd-layout content-home">
        <div className="row margin-bt">
          <div className="col col-3 rounded mx-auto d-block">
          </div>
          <div className="col col-2 rounded mx-auto d-block text-center">
            <a className="nav-link-home p-2" href="/splits"><i className="bi bi-arrow-up-right-square-fill"></i> Chia hàng</a>
          </div>
          <div className="col col-2 rounded mx-auto d-block">
          </div>
          <div className="col col-2 rounded mx-auto d-block text-center">
            <a className="nav-link-home p-2" href="/imports"><i className="bi bi-arrow-up-square-fill"></i> Import tồn kho</a>
          </div>
          <div className="col col-3 rounded mx-auto d-block">
          </div>
        </div>
        <div className="row margin-bt">
          <div className="col col-3 rounded mx-auto d-block">
          </div>
          <div className="col col-2 rounded mx-auto d-block text-center">
          <a className="nav-link-home p-2" href="/stores"><i className="bi bi-house-gear-fill"></i> Cửa hàng</a>
          </div>
          <div className="col col-2 rounded mx-auto d-block">
          </div>
          <div className="col col-2 rounded mx-auto d-block text-center">
          <a className="nav-link-home p-2" href="/categories"><i className="bi bi-house-heart"></i> Loại cửa hàng</a>
          </div>
          <div className="col col-3 rounded mx-auto d-block">
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeComponent;
