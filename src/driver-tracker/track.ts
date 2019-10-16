import { Request, Response } from 'express';

export function track(req: Request, res: Response) {
    // PARSING INPUT
    const { north, west, east, south } =
    req.body;
    if(!north || !west || !east || !south) {
        res.status(400).json({
            ok: false,
            error: "parameter tidak lengkap"         
        });
        return;
    }

    // ENCODE INPUT
    res.json({
        ok: true
    });
}