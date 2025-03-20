import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Users.module.css"; // Assuming you're using a CSS module for styling

interface User {
  Username: string;
  Attributes: { [key: string]: string };
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (username: string) => {
    try {
      await axios.delete(`/api/users/${username}`);
      setUsers(users.filter((user) => user.Username !== username)); // Remove user from UI
    } catch (error) {
      console.error("Error deleting user", error);
      setError("Error deleting user");
    }
  };

  const handleUpdate = async (username: string) => {
    // You can open a modal or navigate to another page to update the user details
    // For now, let's log the username for reference
    console.log("Updating user with Username:", username);
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Management</h1>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.Username}>
              <td>{user.Username}</td>
              <td>{user.Attributes.email}</td> {/* Assuming email is one of the attributes */}
              <td>
                <button
                  onClick={() => handleUpdate(user.Username)}
                  className={styles.updateButton}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user.Username)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
