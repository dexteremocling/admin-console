import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
    await pool.execute(query, [full_name, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", error });
  }
}