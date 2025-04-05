import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Users.module.css";

interface User {
  Username: string;
  Attributes: { [key: string]: string };
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

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

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(`/api/users/${selectedUser}`);
      setUsers(users.filter((user) => user.Username !== selectedUser));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting user", error.response?.data || error.message);
      } else {
        console.error("Unexpected error", error);
      }
      setError("Error deleting user");
    }
  };

  const openDeleteModal = (username: string) => {
    setSelectedUser(username);
    setIsDeleteModalOpen(true);
  };

  const openUpdateModal = (username: string, currentEmail: string) => {
    setSelectedUser(username);
    setNewEmail(currentEmail);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser || !newEmail) return;

    try {
      await axios.put(`/api/users/${selectedUser}`, { email: newEmail });

      setUsers(
        users.map((user) =>
          user.Username === selectedUser ? { ...user, Attributes: { ...user.Attributes, email: newEmail } } : user
        )
      );

      setIsModalOpen(false);
      setSelectedUser(null);
      setNewEmail("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating user", error.response?.data || error.message);
      } else {
        console.error("Unexpected error", error);
      }
      setError("Error updating user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.userContainer}>
      <h1>User Management</h1>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th> {/* New column for Full Name */}
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.Username}>
              <td>{user.Username}</td>
              <td>{user.Attributes.name || "N/A"}</td> {/* Display Full Name */}
              <td>{user.Attributes.email}</td>
              <td>
                <button onClick={() => openUpdateModal(user.Username, user.Attributes.email)} className={styles.updateButton}>
                  Update
                </button>
                <button onClick={() => openDeleteModal(user.Username)} className={styles.deleteButton}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Update User Email</h2>
            <p>Updating email for: <strong>{selectedUser}</strong></p>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              className={styles.inputField}
            />
            <div className={styles.modalActions}>
              <button onClick={handleUpdate} className={styles.saveButton}>Save</button>
              <button onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete <strong>{selectedUser}</strong>?</p>
            <div className={styles.modalActions}>
              <button onClick={handleDelete} className={styles.deleteConfirmButton}>Delete</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
