import { bus } from "./bus";
import { Request, Response } from "express";
import { DriverPerformance } from "./orm";

interface Position {
    rider_id: number;
    north: number;
    west: number;
    east: number;
    south: number;
};

async function performanceUpdater(position: Position) {
    const { north, east, west, south, rider_id } = position;
    const [pos,crt] = await DriverPerformance.findOrCreate({
        defaults: {
            point: 0
        },
        where: {
            rider_id
        }
    })
    
    let point = parseFloat(pos.get("point") as string);
    point = point + calculatePoint(north, east, west, south);
    console.log('update performance');
    try {
        await pos.update({ point });
    } catch(err) {
        console.log(err);
    }
};

function calculatePoint(north: number, east: number, west:number, south:number): number {
    north = parseFloat(north.toString());
    east = parseFloat(east.toString());
    west = parseFloat(west.toString());
    south = parseFloat(south.toString());

    const result = Math.sqrt(Math.pow((north - south), 2) + Math.pow((west - east),2));
    return result;
};

export function performanceProjector(): number {
    return bus.subscribe("rider.moved", (position: Position) => {
        performanceUpdater(position);
    });
};

export async function riderPerformance(req: Request, res: Response) {
    const riderId = req.params.rider_id;
    console.log(riderId)
    if(!riderId){
      res.status(400).json({
        ok: false,
        error: 'rider_id belum dimasukan' 
      })
    return;
    }
    
    const result = await DriverPerformance.findOrCreate({ 
      defaults: { point: 0 },
      where: { rider_id: riderId }, 
    });
    
    const { point } = JSON.parse(JSON.stringify(result[0]));
    console.log(point);
    res.status(200).send({ point });

};
