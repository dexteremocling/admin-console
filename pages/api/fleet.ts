import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const [fleets]: any = await pool.execute("SELECT Id, Name FROM Fleet");
      return res.status(200).json(fleets);
    }

    if (req.method === "POST") {
      const { Name, OrganizationId } = req.body;
      if (!Name || !OrganizationId) return res.status(400).json({ message: "Missing required fields" });

      const [result]: any = await pool.execute(
        "INSERT INTO Fleet (Name, OrganizationId) VALUES (?, ?)",
        [Name, OrganizationId]
      );

      return res.status(201).json({ Id: result.insertId, Name, OrganizationId });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error in fleet API:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}
