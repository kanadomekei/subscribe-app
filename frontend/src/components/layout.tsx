import { Link, Outlet } from "react-router-dom";
import Header from "./header";

const Layout = () => {
  return (
    <div>
      <header>
        <Header />
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
