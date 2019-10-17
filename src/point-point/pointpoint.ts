import { DriverPoint } from "./orm";
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
      points: 0,
    },
    where: {
      rider_id
    }
  });
  // update latitude & longitude
  let points = position.get("points");
  points = parseInt(points) + parseInt(north) + parseInt(south) + parseInt(east) + parseInt(west);

  try {
    await position.update({
      points
    });
  } catch (err) {
    console.error(err);
  }
}

export function pointProjector(): number {
  return bus.subscribe("rider.moved", (movement: Movement) => {
    pointUpdater(movement);
  });
}