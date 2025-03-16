import { useState, useEffect } from "react";
import styles from "@/styles/Auth.module.css"; // Assuming you're using the same styles

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [currentPage, setCurrentPage] = useState("home");
  const [users, setUsers] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const fetchVehicleData = async () => {
    const response = await fetch("/api/tempdata");
    const data = await response.json();
    setVehicleData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      console.log("Registering User", { fullName, email, password });
    } else {
      console.log("Logging in", { email, password });
      setIsLoggedIn(true); // Simulate a successful login
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "userManagement":
        return (
          <div>
            <h2>User Management</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "evDashboard":
        return (
          <div>
            <h2>Electric Vehicle Dashboard</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Temperature</th>
                  <th>Voltage</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.map((data: any) => (
                  <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>{data.temperature}</td>
                    <td>{data.voltage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <h2>Welcome to the EVCare Administration Console</h2>;
    }
  };

  useEffect(() => {
    if (currentPage === "userManagement") {
      fetchUsers();
    } else if (currentPage === "evDashboard") {
      fetchVehicleData();
    }
  }, [currentPage]);

  return (
    <div className={styles.container}>
      {!isLoggedIn ? (
        <div className={styles.authContainer}>
          <h1 className={styles.adminTitle}>Administration Console</h1>
          <div className={styles.formWrapper}>
            <h2 className={styles.title}>{isRegistering ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className={styles.inputField}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className={styles.button}>
                {isRegistering ? "Sign Up" : "Login"}
              </button>
            </form>
            <p
              className={styles.toggleLink}
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.sidebarAndContent}>
          <div className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>EVCare Admin</h2>
            <ul className={styles.menu}>
              <li
                className={styles.menuItem}
                onClick={() => setCurrentPage("home")}
              >
                Home Page
              </li>
              <li
                className={styles.menuItem}
                onClick={() => setCurrentPage("userManagement")}
              >
                User Management
              </li>
              <li
                className={styles.menuItem}
                onClick={() => setCurrentPage("evDashboard")}
              >
                Electric Vehicle Dashboard
              </li>
            </ul>
          </div>

          <div className={styles.mainContent}>{renderContent()}</div>
        </div>
      )}
    </div>
  );
};

export default Home;