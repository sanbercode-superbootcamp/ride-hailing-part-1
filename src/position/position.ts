import { DriverPosition } from "./orm";
import { bus } from "../lib/bus";
import { NatsError } from "nats";

interface Movement {
  rider_id: number;
  north: number;
  west: number;
  east: number;
  south: number;
}

export async function getPosition(req, res) {
  const rider_id = req.params.rider_id;
  if (!rider_id) {
    res.sendStatus(400).json({
      ok: false,
      error: "parameter tidak lengkap"
    });
    return;
  }

  const position = await DriverPosition.findOne({
    where: { rider_id }
  });
  const latitude = position.get("latitude");
  const longitude = position.get("longitude");
  res.send({ latitude, longitude });
}

async function positionUpdater(movement: Movement) {
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
  let latitude = parseFloat(position.get("latitude") as string + (north - south));
  let longitude = parseFloat(position.get("longitude") as string + (east - west));

  console.log('east ', typeof(east));

  try {
    await position.update({
      latitude,
      longitude
    });
  } catch (err) {
    console.error(err);
  }
}

export function positionProjector(): number {
  return bus.subscribe("rider.moved", (movement: Movement) => {
    positionUpdater(movement);
  });
}
