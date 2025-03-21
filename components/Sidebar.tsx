import styles from "@/styles/Sidebar.module.css";
import { useRouter } from "next/router";

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const router = useRouter();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/home" className={styles.navLink}>Home</a>
        </li>
        <li className={styles.navItem}>
          <a href="/users" className={styles.navLink}>User Management</a>
        </li>
        <li className={styles.navItem}>
          <a href="/dashboard" className={styles.navLink}>EV Dashboard</a>
        </li>
        <li className={styles.navItem}>
          <button className={styles.logoutButton} onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;