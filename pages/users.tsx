import { useEffect, useState } from "react";

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


  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Management</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Label</th>
            <th>Organization ID</th>
            <th>Is Active</th>
            <th>Is Admin</th>
            <th>Cognito ID</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}   