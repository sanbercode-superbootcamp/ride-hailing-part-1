import { startServer } from './driver-tracker/server';
import { syncDB } from './driver-tracker/orm';

async function startApp() {
  await syncDB();
  startServer();
}

startApp();
