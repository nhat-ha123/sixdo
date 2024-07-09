"use client";
import "@/styles/header.css";
const AppHeader = () => {
  return (
    <>
      <nav className="bd-subnavbar py-2">
        <div className="container-xxl d-flex align-items-md-center">
          <div className="position-relative me-auto">
            <a className="navbar-brand p-0 me-2" href="/" aria-label="Bootstrap">
              <img title="SIXDO" src="/logo_pink.png" className="d-block my-1"  role="img">
              </img>
            </a>
            {/* <span className="line line2">1222</span> */}
          </div>
          <div className="dropdown ms-3">
            <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">
              <li className="nav-item col-6 col-md-auto">
                <a className="nav-link p-2" href="/splits"><i className="bi bi-arrow-up-right-square"></i> Chia hàng</a>
              </li >
              <li className="nav-item col-6 col-md-auto">
                <a className="nav-link p-2" href="/imports"><i className="bi bi-arrow-up-square"></i> Import tồn kho</a>
              </li>
              <li className="nav-item col-6 col-md-auto">
                <a className="nav-link p-2" href="/stores"><i className="bi bi-house-gear"></i> Cửa hàng</a>
              </li>
              <li className="nav-item col-6 col-md-auto">
                <a className="nav-link p-2" href="/categories"><i className="bi bi-house-heart"></i> Loại cửa hàng</a>
              </li>
              <li className="nav-item col-6 col-md-auto">
                <a className="btn btn-bd-logout d-lg-inline-block my-2 my-md-0 ms-md-3" href="/"><i className="bi bi-capslock"></i> Exit </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppHeader;
