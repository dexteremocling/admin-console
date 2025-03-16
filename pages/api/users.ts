import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const [users]: any = await pool.execute(`
      SELECT Id, Label, OrganizationId, IsActive, CognitoId, IsAdmin FROM User
    `);

    // Convert bit values (IsActive, IsAdmin) to boolean
    const formattedUsers = users.map((user: any) => ({
      ...user,
      IsActive: user.IsActive[0] === 1, // Convert Bit(1) to true/false
      IsAdmin: user.IsAdmin[0] === 1,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: "Database error", error });
  }
}
