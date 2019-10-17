import { startServer } from './server';
import { syncDB } from './orm';
import { connectToBus } from './bus';
import { positionProjector } from './position';

async function startApp() {
    try {
        await syncDB();
        await connectToBus();
    } catch(err){
        console.log(err)
    }
    positionProjector();
    startServer();
}

startApp();