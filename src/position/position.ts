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

async function positionUpdater(movement: Movement) { //movement return object
  console.log(movement);
  console.log("das ist 2");
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
  let latitude = position.get("latitude");
  latitude = parseInt(latitude) + parseInt(north) - parseInt(south);
  let longitude = position.get("longitude");
  longitude = parseInt(longitude) + parseInt(east) - parseInt(west);

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