import { ScoreGenerator } from "./orm";
import { bus } from "./bus";
import { NatsError } from "nats";

interface Position {
  rider_id: number;
  latitude: number;
  longitude: number;
}

async function scoreUpdater(driver_position: Position) {
  const { rider_id, latitude, longitude } = driver_position;
  console.log("update score");
  // update driver position
  const [current_score, created] = await ScoreGenerator.findOrCreate({
    defaults: {
      score: 0
    },
    where: {
      rider_id
    }
  });
  // update latitude & longitude
  let score = parseFloat(current_score.get("score") as string);
  score = Math.round(ukurJarak(Math.abs(Number(latitude)), Math.abs(Number(longitude)))*100)/100;

  try {
    await current_score.update({
      score
    });
  } catch (err) {
    console.error(err);
  }
}

export function ScorePredictor(): number {
    return bus.subscribe("rider.position", (driver_position : Position) => {
        scoreUpdater(driver_position)
    })
}

function ukurJarak(latitude, longitude){
    if(latitude == 0 && longitude == 0){
        return 0
    }else if(latitude == 0){
        return longitude
    }else if(longitude == 0){
        return latitude
    }else{
        return (latitude**2 + longitude**2)**0.5
    }
}