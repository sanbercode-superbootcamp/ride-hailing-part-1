import { DriverPoint } from './orm';
import { bus } from "./bus";
import { DataTypes } from 'sequelize/types';

interface Movement {
    rider_id: number;
    north: number;
    west: number;
    east: number;
    south: number;
}

async function pointUpdater(movement: Movement) {
    const { rider_id, north, south, east, west } = movement;

    const [position, created] = await DriverPoint.findOrCreate({
        // update driver point
        defaults: {
            point: 0
        },
        where: {
            rider_id
        }
    });
    // update latitude & longitude
    let point = parseFloat(position.get("point") as string);
    point += calcDisplacement(north, south, east, west);
    console.log(`update point ${point}`);
    try {
        await position.update({
            point
        });
    } catch (err) {
        console.error(err);
    }
}

function calcDisplacement(n: number, s: number, e: number, w: number): number {
    n = parseFloat(n.toString());
    s = parseFloat(s.toString());
    w = parseFloat(w.toString());
    e = parseFloat(e.toString());
    const result = Math.sqrt(Math.pow((n - s), 2) + Math.pow((w - e), 2));
    return result;
}

export function positionProjector(): number {
    return bus.subscribe("rider.moved", (movement: Movement) => {
        pointUpdater(movement);
    });
}

export async function getPoint(req, res) {
    const id = req.params.rider_id;
    if (!id) {
        res.sendStatus(400).json({
            ok: false,
            error: "parameter tidak lengkap"
        });
        return;
    }

    const result = await DriverPoint.findAll({ where: { rider_id: id }, raw: true });
    const { point } = JSON.parse(JSON.stringify(result[0]));
    res.send({ point });
}