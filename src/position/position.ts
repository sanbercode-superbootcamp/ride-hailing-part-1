import { bus } from "./bus";
import {DriverPosition} from './orm'

interface Movement {
    rider_id: number;
    north: number;
    west: number;
    east: number;
    south: number;
}

async function positionUpdater(movement: Movement) {
    const {north, south, east, west, rider_id} = movement;
    const [position, created] = await DriverPosition.findOrCreate({
        defaults:{
            latitude: 0,
            longitude: 0
        },
        where: {
            rider_id
        }
    });
    let latitude = parseFloat(position.get('latitude') as string);
    latitude = latitude + parseFloat(north.toString()) - parseFloat(south.toString());
    let longitude = parseFloat(position.get('longitude') as string);
    longitude = longitude + parseFloat(east.toString()) - parseFloat(west.toString());
    try{
        await position.update(
            {
                latitude,
                longitude
            }
        );
    } catch(err){
        console.log(err);
    } 
}

export function positionProjector(): number {
    return bus.subscribe('rider.moved', (movement: Movement) => {
        positionUpdater(movement);
    })
}