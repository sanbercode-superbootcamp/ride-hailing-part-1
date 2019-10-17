import { DriverPosition } from './orm';
import { connectToBus, bus } from './bus';
import { NatsError } from 'nats';

interface Movement {
    rider_id: number;
    north: number;
    west: number;
    east: number;
    south: number;
}

export async function positionUpdater(movement: Movement) {
    const {
        north, west, east, south, rider_id
    } = movement;

    // UPDATE DRIVER POSITION
    const [position, created] = await
    DriverPosition.findOrCreate({
        defaults: {
            latitude: 0,
            longitude: 0
        }, where: {
            rider_id
        }
    });

    // UPDATE LONGITUDE LATITUDE
    let latitude = parseFloat(position.get("latitude") as string);
    latitude = latitude + north - south;
    let longitude = parseFloat(position.get("longitude") as string);
    longitude = longitude + east - west;
    
    try {
        await position.update({
            latitude,
            longitude
        });
    } catch(err) {
        console.log(err);
    }
}

export function positionProjector(): number {
    return bus.subscribe("rider.moved", (movement: Movement) => {
        positionUpdater(movement);
    });
}