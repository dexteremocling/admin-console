import styles from "@/styles/Sidebar.module.css";
import { useRouter } from "next/router";
import Image from "next/image"; // Import Image component for images

const Sidebar = ({ onLogout, userName }: { onLogout: () => void; userName: string }) => {
  const router = useRouter();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Image src="/images/evcare_logo.png" alt="EVCare Logo" width={100} height={100} />
      </div>

      {/* Ensure userName is displayed properly */}
      <div className={styles.welcomeMessage}>
        <p>Welcome back, <br /><strong>{userName}</strong>!</p>
      </div>

      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/home" className={styles.navLink}>
            <Image src="/images/home_icon.png" alt="Home" width={32} height={32} className={styles.navIcon} />
            Home
          </a>
        </li>
        <li className={styles.navItem}>
          <a href="/users" className={styles.navLink}>
            <Image src="/images/user_icon.png" alt="User Management" width={32} height={32} className={styles.navIcon} />
            User Management
          </a>
        </li>
        <li className={styles.navItem}>
          <a href="/fleet" className={styles.navLink}>
            <Image src="/images/fleet_icon.png" alt="Fleet Management" width={32} height={32} className={styles.navIcon} />
            Fleet Management
          </a>
        </li>
        <li className={styles.navItem}>
          <a href="/dashboard" className={styles.navLink}>
            <Image src="/images/dashboard_icon.png" alt="EV Battery Dashboard" width={32} height={32} className={styles.navIcon} />
            EV Battery Dashboard
          </a>
        </li>
      </ul>

      {/* Move logout button up a bit */}
      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
