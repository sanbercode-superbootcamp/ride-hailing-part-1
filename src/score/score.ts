import { bus } from "./bus";
import {DriverPosition, DriverScore} from './orm'

interface Movement {
    rider_id: number;
    north: number;
    west: number;
    east: number;
    south: number;
}

async function scoreUpdater(movement: Movement) {
    const {north, south, east, west, rider_id} = movement;
    const [scoreRide, created] = await DriverScore.findOrCreate({
        defaults:{
            score: 0,
            distance: 0
        },
        where: {
            rider_id
        }
    });
    let distance = parseFloat(scoreRide.get('distance') as string);
    distance = distance + parseFloat(north.toString()) + parseFloat(south.toString()) + parseFloat(east.toString()) + parseFloat(west.toString());
    console.log('scoreUpdater distance: '+distance);
    let score = parseFloat(scoreRide.get('score') as string);
    score = Math.floor(distance/1000);
    console.log('scoreUpdater score: '+score);
    try{
        await scoreRide.update(
            {
                score,
                distance
            }
        );
    } catch(err){
        console.log(err);
    } 
}

export function scoreProjector(): number {
    return bus.subscribe('rider.moved', (movement: Movement) => {
        console.log('score subcribe');
        scoreUpdater(movement);
    })
}