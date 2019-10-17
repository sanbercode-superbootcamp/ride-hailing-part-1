import { DriverPosition } from './orm';
import { connectToBus, bus } from './bus';
import { NatsError } from 'nats';

interface Movement {
    rider_id: number;
    north: string;
    west: string;
    east: string;
    south: string;
}

export async function showPosition(req, res) {
    const rider_id = req.params.rider_id;
    console.log('showPosition param: '+rider_id);

    try{
        const show = await DriverPosition.findAll({
            where: {
                rider_id: rider_id
            }
        });
        console.log('isi show: '+show[0]);
        res.send(`{ ${show[0]['latitude']}, ${show[0]['longitude']} }`)
    }catch(err){
        console.log('error di showPosition: '+err);
    }
}

export async function positionUpdater(movement: Movement) {
    const rider_id = movement.rider_id;
    const north = parseFloat(movement.north);
    const west = parseFloat(movement.west);
    const east = parseFloat(movement.east);
    const south = parseFloat(movement.south);

    // UPDATE DRIVER POSITION
    const [position, created] = await DriverPosition.findOrCreate({
        defaults: {
          latitude: 0,
          longitude: 0
        },
        where: {
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
    } catch (err) {
    console.error(err);
    }
}

export function positionProjector(): number {
    return bus.subscribe("rider.moved", (movement: Movement) => {
        positionUpdater(movement);
    });
}