import { startServer } from './server';
import { syncDB } from './orm';
import { connectToBus } from './bus';
import { pointProjector } from './pointpoint';

async function startApp() {
  await syncDB();
  await connectToBus();
  pointProjector();
  startServer();
}

startApp();
