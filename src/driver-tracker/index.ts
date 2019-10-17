import {startServer} from './server'
import { syncDB } from './orm';
import { connectToBus } from './bus';

async function startApp() {
    await syncDB();
    await connectToBus();
    startServer();
}

startApp();