import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { powerUnitId } = req.query;

    if (powerUnitId) {
      // Fetch battery details from tempdata
      const [batteryDetails]: any = await pool.execute(
        `SELECT PowerUnitId, PackTemperatureScore, ChargeRateScore, DischargeRateScore, 
                TimeAtSOCScore, BatteryCycleCount, OEMMaxCycleCount, StateOfHealth 
         FROM tempdata 
         WHERE PowerUnitId = ?`,
        [powerUnitId]
      );
      return res.status(200).json(batteryDetails[0] || {});
    }

    // Fetch list of batteries
    const [batteryList]: any = await pool.execute(
      "SELECT PowerUnitId FROM FitStarModelAssignment"
    );
    return res.status(200).json(batteryList);
  } catch (error) {
    console.error("Error fetching battery data:", error);
    return res.status(500).json({ message: "Failed to fetch data", error });
  }
}
