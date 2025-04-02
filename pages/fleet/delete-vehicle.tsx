import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DeleteVehicle() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/vehiclesfleets?id=${id}`, { method: "DELETE" }).then(() => router.push("/fleet"));
    }
  }, [id]);

  return <p>Deleting vehicle...</p>;
}
