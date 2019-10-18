import { bus } from "./bus";
import { Request, Response } from "express";
import { DriverPerformance } from "./orm";

interface Movement {
    rider_id: number;
    north: number;
    west: number;
    east: number;
    south: number;
  }

export async function performanceUpdater(movement: Movement) {
    const { north, south, east, west, rider_id } = movement;
    console.log('update point')
    const [position, created] = await DriverPerformance.findOrCreate({
        defaults: {
            point: 0
        },
        where: {
            rider_id
        }
    })

    let point = parseFloat(position.get("point") as string);
    let latitude = parseFloat(JSON.stringify(north)) - parseFloat(JSON.stringify(south))
    let longitude = parseFloat(JSON.stringify(west)) - parseFloat(JSON.stringify(east))
    point = point + (Math.sqrt(Math.pow(latitude, 2) + Math.pow(longitude, 2)))
    try {
        await position.update({ 
            point
        });
    } catch(err) {
        console.log(err);
    }
};

// function calculatePoint(north: number, east: number, west:number, south:number): number {
//     north = parseFloat(north.toString());
//     east = parseFloat(east.toString());
//     west = parseFloat(west.toString());
//     south = parseFloat(south.toString());

//     const result = Math.sqrt(Math.pow((north - south), 2) + Math.pow((west - east),2));
//     return result;
// };

export function performanceProjector(): number {
    return bus.subscribe("rider.moved", (movement: Movement) => {
        performanceUpdater(movement);
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
    
    const result = await DriverPerformance.findAll({ 
      where: { rider_id: riderId },
      raw: true
    });
    
    const { point } = JSON.parse(JSON.stringify(result[0]));
    
    res.send({ point });

};

