import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Users.module.css"; // Assuming you're using a CSS module for styling

interface User {
  Id: string;
  Label: string;
  OrganizationId: string;
  IsActive: boolean;
  IsAdmin: boolean;
  CognitoId: string;
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

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter((user) => user.Id !== userId)); // Remove user from UI
    } catch (error) {
      console.error("Error deleting user", error);
      setError("Error deleting user");
    }
  };

  const handleUpdate = async (userId: string) => {
    // You can open a modal or navigate to another page to update the user details
    // For now, let's log the userId for reference
    console.log("Updating user with ID:", userId);
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Management</h1>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Label</th>
            <th>Organization ID</th>
            <th>Is Active</th>
            <th>Is Admin</th>
            <th>Cognito ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.Id}>
              <td>{user.Id}</td>
              <td>{user.Label}</td>
              <td>{user.OrganizationId}</td>
              <td>{user.IsActive ? "Active" : "Inactive"}</td>
              <td>{user.IsAdmin ? "Admin" : "User"}</td>
              <td>{user.CognitoId}</td>
              <td>
                <button
                  onClick={() => handleUpdate(user.Id)}
                  className={styles.updateButton}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user.Id)}
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
