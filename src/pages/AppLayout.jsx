import Map from "../components/Map";
import User from "../components/User";
import Sidebar from "../components/navigationComponents/Sidebar";
import styles from "./AppLayout.module.css";
import ProtectedRoute from "./ProtectedRoute";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
