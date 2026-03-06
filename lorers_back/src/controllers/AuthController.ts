import type { Request, Response } from 'express';
import { AuthService } from "../services/AuthService.js";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        res.json({ token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};
