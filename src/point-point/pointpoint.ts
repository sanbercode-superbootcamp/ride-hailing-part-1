import { DriverPoint, TrackEvent } from "./orm";
import { Request, Response } from "express";
import { bus } from "./bus";
import { NatsError } from "nats";

interface Movement {
  rider_id: number;
  north: number;
  west: number;
  east: number;
  south: number;
}

async function pointUpdater(movement: Movement) { //movement return object
  console.log(movement);
  const { north, south, east, west, rider_id } = movement;
  console.log("update point");
  // update driver position
  const [position, created] = await DriverPoint.findOrCreate({
    defaults: {
      jarak_tempuh: 0,
      points: 0,
    },
    where: {
      rider_id
    }
  });

  const drivermovement = await TrackEvent.findAll({
    attributes: {
      north,
      west,
      east,
      south
    },
    raw: true;
  });


  // update latitude & longitude
  let jarak_tempuh = null;
  let points = position.get("points");
  drivermovement.forEach(function(element){
    jarak_tempuh += parseInt(element.north) + parseInt(element.south) + parseInt(element.east) + parseInt(element.west);
  });
  console.log("thepointsss",jarak_tempuh)
  if(jarak_tempuh >= 100000){
    points = jarak_tempuh * 0.00001;
    points = parseInt(points);
  }


  try {
    await position.update({
      jarak_tempuh,
      points
    });
  } catch (err) {
    console.error(err);
  }
}

export async function getRiderPoint(req: Request, res: Response) {
  const rider_id = req.params.rider_id;
  if (!rider_id) {
    res.status(400).json({
      ok: false,
      error: "parameter tidak lengkap"
    });
    return;
  }

  // get rider position
  const pointdb = await DriverPoint.findOne({
    where: { rider_id }
  });
  if (!pointdb) {
    res.status(404).json({
      ok: false,
      error: "rider tidak ditemukan"
    });
    return;
  }
  const point = pointdb.get("points");

  // encode output
  res.json({
    ok: true, point 
  });
}

export function pointProjector(): number {
  return bus.subscribe("rider.moved", (movement: Movement) => {
    pointUpdater(movement);
  });
}