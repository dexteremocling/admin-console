// pages/api/ev-dashboard.ts
import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Fetch data from the tempdata table
    const [tempData]: any = await pool.execute("SELECT * FROM tempdata");

    // Return the data as JSON
    res.status(200).json(tempData);
  } catch (error) {
    console.error("Error fetching EV data:", error);
    res.status(500).json({ message: "Failed to fetch data", error });
  }
}
