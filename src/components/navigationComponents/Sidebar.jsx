import Logo from "../Logo";
import AppNav from "../AppNav";
import styles from "./Sidebar.module.css";
import Copyright from "../Copyright";
import { Outlet } from "react-router-dom";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <Copyright />
    </div>
  );
}

export default Sidebar;
