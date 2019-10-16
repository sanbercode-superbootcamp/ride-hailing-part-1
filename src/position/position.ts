import { DriverPosition } from "./orm";
import { bus } from "./bus";
import { NatsError } from "nats";

interface Movement {
  rider_id: number;
  north: number;
  west: number;
  east: number;
  south: number;
}

async function positionUpdater(movement: Movement) {
  const { rider_id, north, south, east, west } = movement;
  console.log("update position");
  //console.table(movement);
  const [position, created] = await DriverPosition.findOrCreate({
    // update driver position
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
}

export function positionProjector(): number {
  return bus.subscribe("rider.moved", (movement: Movement) => {
    positionUpdater(movement);
  });
}

export async function getPosition(req, res) {
  const id = req.params.rider_id;
  if (!id) {
    res.sendStatus(400).json({
      ok: false,
      error: "parameter tidak lengkap"
    });
    return;
  }

  const result = await DriverPosition.findAll({ where: { rider_id: id }, raw: true });
  const { latitude, longitude } = JSON.parse(JSON.stringify(result[0]));
  res.send({ latitude, longitude });
}