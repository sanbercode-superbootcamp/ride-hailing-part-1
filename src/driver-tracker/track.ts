import { Request, Response } from "express";
import { TrackEvent } from "./orm";
import { bus } from "../lib/bus";

export async function track(req: Request, res: Response) {
  // parsing input
  let { rider_id, north, west, east, south } = req.body;
  if (!rider_id || !north || !west || !east || !south) {
    res.status(400).json({
      ok: false,
      error: "parameter tidak lengkap"
    });
    return;
  }


  // save tracking movement
  const track = new TrackEvent({
    rider_id,
    north,
    west,
    east,
    south
  });
  try {
    await track.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      message: "gagal menyimpan data"
    });
    return;
  }

  bus.publish("rider.moved", {
    rider_id,
    north,
    west,
    east,
    south
  });

  // encode output
  res.json({
    ok: true
  });
}
