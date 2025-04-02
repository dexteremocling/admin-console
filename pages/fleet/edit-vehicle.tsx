import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Vehicle {
  Id: number;
  AssetCode: string;
  Make: string;
  Model: string;
  ModelYear: number;
}

export default function EditVehicle() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchVehicle() {
      if (!id) return;
      const res = await fetch(`/api/vehiclesfleets?id=${id}`);
      if (res.ok) {
        const data: Vehicle = await res.json();
        setVehicle(data);
      }
    }
    fetchVehicle();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    
    const res = await fetch("/api/vehiclesfleets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });
    if (res.ok) router.push("/fleet");
  };

  if (!vehicle) return <p>Loading...</p>;

  return (
    <form onSubmit={handleUpdate}>
      <h2>Edit Vehicle</h2>
      <input name="AssetCode" value={vehicle.AssetCode} onChange={handleChange} required />
      <button type="submit">Update</button>
    </form>
  );
}
