import { Request, Response } from 'express';
import { TrackEvent } from './orm';

export async function track(req: Request, res: Response) {
    // PARSING INPUT
    const { rider_id, north, west, east, south } =
    req.body;
    if(!rider_id || !north || !west || !east || !south) {
        res.status(400).json({
            ok: false,
            error: "parameter tidak lengkap"         
        });
        return;
    }

    // SAVE TRACKING MOVEMENT
    const track = new TrackEvent({
        rider_id,
        north,
        west,
        east,
        south
    });

    try{
        await track.save();
    } catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            message: "gagal menyimpan data"
        });
        return;
    }
    

    // ENCODE INPUT
    res.json({
        ok: true
    });
}