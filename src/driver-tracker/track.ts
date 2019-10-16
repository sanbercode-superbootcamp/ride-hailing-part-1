import { Request, Response } from 'express';

export function track(req: Request, res: Response) {
  // parsing input
  const { north, west, east, south } = req.body;
  if (!north || !west || !east || !south) {
    res.status(400).json({
      ok: false,
      error: 'parameter tidak lengkap'
    });
    return;
  }

  // encode output
  res.json({
    ok: true
  });
}
