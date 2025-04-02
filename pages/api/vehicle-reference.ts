import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

interface VehicleReference {
  Id: number;
  Make: string;
  Model: string;
  ModelYear: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { Make, Model, ModelYear } = req.body;

    try {
      // Find if the vehicle reference already exists in the database
      const [rows] = await pool.execute(
        "SELECT * FROM VehicleReference WHERE Make = ? AND Model = ? AND ModelYear = ?",
        [Make, Model, ModelYear]
      );

      // Type cast the result to an array
      const vehicleReferences = rows as VehicleReference[];

      if (vehicleReferences.length > 0) {
        return res.status(200).json(vehicleReferences[0]);
      }

      // If no vehicle reference exists, create a new record
      const [result] = await pool.execute(
        "INSERT INTO VehicleReference (Make, Model, ModelYear) VALUES (?, ?, ?)",
        [Make, Model, ModelYear]
      );

      const insertId = (result as { insertId: number }).insertId;

      const newVehicleReference = {
        Id: insertId,
        Make,
        Model,
        ModelYear,
      };

      return res.status(201).json(newVehicleReference);
    } catch (error) {
      console.error("Error inserting vehicle reference:", error);
      res.status(500).json({ message: "Failed to create vehicle reference" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
