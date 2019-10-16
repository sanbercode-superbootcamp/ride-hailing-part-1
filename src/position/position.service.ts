import { Request, Response } from "express";
import { DriverPosition } from "./orm";

export async function getPosition(req: Request, res: Response) {
  // parsing input
  let id = req.params;
  console.log(id)
  if (!id) {
    res.status(400).json({
      ok: false,
      error: "rider_id tidak ada"
    });
    return;
  }

  try{
        DriverPosition.findOne({
            where : {rider_id : Number(id.rider_id)},
            attributes : ['latitude', 'longitude']
        }).then((result) => {
            res.json(result)
        })
  }catch(err){
      console.log(err)
      res.status(400)
  }
  
}
