import { startServer } from './server';
import { syncDB } from './orm';
import { connectToBus } from './bus';
import { ScorePredictor } from "./score";

async function startApp() {
  await syncDB();
  await connectToBus();
  ScorePredictor();
  startServer();
}

startApp();
