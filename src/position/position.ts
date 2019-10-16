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
  latitude = latitude + Number(east) - Number(west);
  let longitude = parseFloat(position.get("longitude") as string);
  longitude = longitude + Number(north) - Number(south);

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
    longitude,
    latitude
  });
}

export function positionProjector(): number {
  return bus.subscribe("rider.moved", (movement: Movement) => {
    positionUpdater(movement);
  });
}
