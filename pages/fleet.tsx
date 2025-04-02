import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Fleet.module.css";

interface Fleet {
  Id: number;
  Name: string;
}

interface Vehicle {
  Id: number;
  AssetCode: string;
  Make: string;
  Model: string;
  ModelYear: number;
}

export default function FleetManagement() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedFleet, setSelectedFleet] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFleets = async () => {
      try {
        const response = await fetch("/api/fleet");
        if (!response.ok) throw new Error("Failed to fetch fleets");
        const data = await response.json();
        setFleets(data);

        if (data.length > 0) {
          setSelectedFleet(data[0].Id);
          fetchVehicles(data[0].Id);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchFleets();
  }, []);

  const fetchVehicles = async (fleetId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vehiclesfleets?fleetId=${fleetId}`);
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();
      setVehicles(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFleetChange = (fleetId: number) => {
    setSelectedFleet(fleetId);
    fetchVehicles(fleetId);
  };

  return (
    <div className={styles.fleetContainer}>
      <h2>Fleet Management</h2>

      {/* Fleet Dropdown */}
      <select
        className={styles.dropdown}
        value={selectedFleet || ""}
        onChange={(e) => handleFleetChange(Number(e.target.value))}
      >
        {fleets.map((fleet) => (
          <option key={fleet.Id} value={fleet.Id}>
            {fleet.Name}
          </option>
        ))}
      </select>

      {/* Vehicles Table */}
      {selectedFleet && (
        <div className={styles.fleetSection}>
          <button className={styles.addButton} onClick={() => router.push(`/fleet/add-vehicle?fleetId=${selectedFleet}`)}>
            Add Vehicle
          </button>
          {loading ? (
            <p>Loading vehicles...</p>
          ) : vehicles.length > 0 ? (
            <table className={styles.vehicleTable}>
              <thead>
                <tr>
                  <th>Asset Code</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Model Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.Id}>
                    <td>{vehicle.AssetCode}</td>
                    <td>{vehicle.Make}</td>
                    <td>{vehicle.Model}</td>
                    <td>{vehicle.ModelYear}</td>
                    <td>
                      <button className={styles.editButton} onClick={() => router.push(`/fleet/edit-vehicle?id=${vehicle.Id}`)}>
                        Edit
                      </button>
                      <button className={styles.deleteButton} onClick={() => router.push(`/fleet/delete-vehicle?id=${vehicle.Id}`)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No vehicles found for this fleet.</p>
          )}
        </div>
      )}
    </div>
  );
}
