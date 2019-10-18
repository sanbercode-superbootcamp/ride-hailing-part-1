import { DriverPosition } from "./orm";
import { bus } from "./bus";
import { NatsError } from "nats";
import { Request, Response } from "express";

 interface Movement {
  rider_id: number;
  north: number;
  west: number;
  east: number;
  south: number;
}

export async function positionUpdater(movement: Movement) {
  const { north, south, east, west, rider_id } = movement;
  console.log("update position");
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
  let latitude = parseFloat(position.get("latitude") as string);
  latitude = latitude + parseFloat(north.toString()) - parseFloat(south.toString());
  let longitude = parseFloat(position.get("longitude") as string);
  longitude = longitude + parseFloat(east.toString()) - parseFloat(west.toString());

  try {
    await position.update({
      latitude,
      longitude
    });
  } catch (err) {
    console.error(err);
  }

  bus.publish("rider.position", {
    rider_id,
    latitude,
    longitude
  });
}

export function positionProjector(): number {
  return bus.subscribe("rider.moved", (movement: Movement) => {
    positionUpdater(movement);
  });
}

export async function riderPos(req: Request, res: Response) {
  const riderId = req.params.rider_id;

  if(!riderId){
    res.status(400).json({
      ok: false,
      error: 'rider_id belum dimasukan' 
    })
  return;
  }
  
  const result = await DriverPosition.findAll({ 
    where: { rider_id: riderId }, 
    raw: true 
  });

  const { latitude, longitude } = JSON.parse(JSON.stringify(result[0]));

  res.status(200).send({ latitude, longitude });
}
