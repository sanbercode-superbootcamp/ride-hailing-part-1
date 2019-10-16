import { bus } from "./bus";
import {DriverPosition} from './orm'
import { parse } from "url";
import { Dictionary } from "lodash";

interface Movement {
    rider_id: number;
    north: number;
    west: number;
    east: number;
    south: number;
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
        res.json({
            show
        })
    }catch(err){
        console.log('error di showPosition: '+err);
    }
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