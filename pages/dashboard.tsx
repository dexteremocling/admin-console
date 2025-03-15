import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axios.get("/api/vehicles")
      .then(response => setVehicles(response.data))
      .catch(error => console.error("Error fetching vehicles:", error));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>EV Dashboard</h1>
      <table border={1} style={{ margin: "0 auto" }}>
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Battery Level (%)</th>
            <th>Charging Status</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle: any) => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>{vehicle.battery_level}%</td>
              <td>{vehicle.charging_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
