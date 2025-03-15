import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { fullName, email } = req.body;

    try {
        const query = 'INSERT INTO users (full_name, email) VALUES (?, ?)';
        const [result] = await pool.execute(query, [fullName, email]);

        res.status(201).json({ message: 'User registered successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database error', error });
    }
}
