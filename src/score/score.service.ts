import { Request, Response } from "express";
import { ScoreGenerator } from "./orm";

export async function getScore(req: Request, res: Response) {
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
        ScoreGenerator.findOne({
            where : {rider_id : Number(id.rider_id)},
            attributes : ['score']
        }).then((result) => {
            res.json(result)
        })
  }catch(err){
      console.log(err)
      res.status(400)
  }
  
}
