import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Fleet.module.css";

interface Fleet {
  Id: number;
  Name: string;
  OrganizationId: number;  // Fleet's OrganizationId
}

export default function AddVehicle() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [formData, setFormData] = useState({
    Make: "",
    Model: "",
    ModelYear: "",
    AssetCode: "",
    FleetId: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const fleetsRes = await fetch("/api/fleet");
        if (!fleetsRes.ok) {
          throw new Error("Failed to fetch fleets");
        }

        const data = await fleetsRes.json();
        setFleets(data);
      } catch (err: any) {
        console.error("Error fetching fleets:", err);
        setError("Error loading data. Please try again.");
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Make || !formData.Model || !formData.ModelYear || !formData.AssetCode || !formData.FleetId) {
      setError("All fields are required.");
      return;
    }

    // Find the OrganizationId based on the selected FleetId
    const selectedFleet = fleets.find(fleet => fleet.Id === Number(formData.FleetId));
    if (!selectedFleet) {
      setError("Please select a valid fleet.");
      return;
    }

    const vehicleReferenceData = {
      Make: formData.Make,
      Model: formData.Model,
      ModelYear: formData.ModelYear,
    };

    try {
      // Check if the VehicleReference already exists
      const vehicleReferenceRes = await fetch("/api/vehicle-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleReferenceData),
      });

      if (!vehicleReferenceRes.ok) {
        const errorData = await vehicleReferenceRes.json();
        throw new Error(errorData.message || "Failed to add vehicle reference");
      }

      const vehicleReference = await vehicleReferenceRes.json();

      const vehicleData = {
        AssetCode: formData.AssetCode,
        FleetId: formData.FleetId,
        VehicleReferenceId: vehicleReference.Id,
        OrganizationId: selectedFleet.OrganizationId, // Use the OrganizationId from the Fleet
      };

      // Now create the vehicle
      const response = await fetch("/api/vehiclesfleets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add vehicle");
      }

      router.push("/fleet");
    } catch (err: any) {
      console.error("Error adding vehicle:", err);
      setError(err.message);
    }
  };

  return (
    <div className={styles.fleetContainer}>
      <h2>Add Vehicle</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Make:</label>
        <input type="text" name="Make" value={formData.Make} onChange={handleChange} required />

        <label>Model:</label>
        <input type="text" name="Model" value={formData.Model} onChange={handleChange} required />

        <label>Model Year:</label>
        <input type="number" name="ModelYear" value={formData.ModelYear} onChange={handleChange} required />

        <label>Asset Code:</label>
        <input type="text" name="AssetCode" value={formData.AssetCode} onChange={handleChange} required />

        <label>Fleet:</label>
        <select name="FleetId" value={formData.FleetId} onChange={handleChange} required>
          <option value="">Select Fleet</option>
          {fleets.map((fleet) => (
            <option key={fleet.Id} value={fleet.Id}>
              {fleet.Name}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.addButton}>Add Vehicle</button>
      </form>
    </div>
  );
}
