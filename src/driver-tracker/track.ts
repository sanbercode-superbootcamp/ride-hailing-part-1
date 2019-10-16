import { Request, Response } from "express";
import { TrackEvent, DriverPosition } from "./orm";
import { delay } from "bluebird";

export async function track(req: Request, res: Response) {
  // parsing input
  const { rider_id, north, west, east, south } = req.body;
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

  // update driver position
  const [position, created] = await DriverPosition.findOrCreate({
    defaults: {
      latitude: 0,
      longitude: 0
    },
    where: {
      rider_id
    }
  });
  // update latitude & longitude
  let latitude = position.get("latitude");
  latitude = latitude + north - south;
  let longitude = position.get("longitude");
  longitude = longitude + east - west;

  try {
    await position.update({
      latitude,
      longitude
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      message: "gagal menyimpan posisi driver"
    });
    return;
  }

  // encode output
  res.json({
    ok: true
  });
}
