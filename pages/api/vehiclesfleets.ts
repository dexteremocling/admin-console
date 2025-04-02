import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { fleetId, id } = req.query;

      if (id) {
        const [vehicle]: any = await pool.execute(
          `SELECT Vehicle.Id, Vehicle.AssetCode, VehicleReference.Make, 
            VehicleReference.Model, VehicleReference.ModelYear
           FROM Vehicle
           JOIN VehicleReference ON Vehicle.VehicleReferenceId = VehicleReference.Id
           WHERE Vehicle.Id = ?`,
          [id]
        );
        return res.status(200).json(vehicle[0] || {});
      }

      if (fleetId) {
        const [vehicles]: any = await pool.execute(
          `SELECT Vehicle.Id, Vehicle.AssetCode, VehicleReference.Make, 
            VehicleReference.Model, VehicleReference.ModelYear
           FROM Vehicle
           JOIN VehicleReference ON Vehicle.VehicleReferenceId = VehicleReference.Id
           WHERE Vehicle.FleetId = ?`,
          [fleetId]
        );
        return res.status(200).json(vehicles);
      }

      return res.status(400).json({ message: "Fleet ID or Vehicle ID required" });
    }

    if (req.method === "POST") {
      const { Make, Model, ModelYear, AssetCode, FleetId, OrganizationId } = req.body;

      if (!Make || !Model || !ModelYear || !AssetCode || !FleetId || !OrganizationId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Insert into VehicleReference if it doesn't exist
      const [refResult]: any = await pool.execute(
        "INSERT INTO VehicleReference (Make, Model, ModelYear) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Id=LAST_INSERT_ID(Id)",
        [Make, Model, ModelYear]
      );

      const vehicleReferenceId = refResult.insertId;

      // Insert into Vehicle
      const [result]: any = await pool.execute(
        "INSERT INTO Vehicle (OrganizationId, AssetCode, VehicleReferenceId, FleetId) VALUES (?, ?, ?, ?)",
        [OrganizationId, AssetCode, vehicleReferenceId, FleetId]
      );

      return res.status(201).json({ Id: result.insertId, Make, Model, ModelYear, AssetCode, FleetId, OrganizationId });
    }

    if (req.method === "PUT") {
      const { Id, AssetCode } = req.body;

      if (!Id || !AssetCode) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await pool.execute("UPDATE Vehicle SET AssetCode = ? WHERE Id = ?", [AssetCode, Id]);
      return res.status(200).json({ message: "Vehicle updated successfully" });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "Vehicle ID is required" });

      await pool.execute("DELETE FROM Vehicle WHERE Id = ?", [id]);
      return res.status(200).json({ message: "Vehicle deleted successfully" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error in vehiclesfleets API:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}
