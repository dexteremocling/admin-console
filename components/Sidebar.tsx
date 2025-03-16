import styles from "@/styles/Sidebar.module.css";

const Sidebar = () => {
  return (
    <nav>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/" className={styles.navLink}>Home</a>
        </li>
        <li className={styles.navItem}>
          <a href="/users" className={styles.navLink}>User Management</a>
        </li>
        <li className={styles.navItem}>
          <a href="/dashboard" className={styles.navLink}>Electric Vehicle Dashboard</a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
