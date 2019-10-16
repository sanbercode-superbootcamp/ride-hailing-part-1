import * as express from 'express'
import * as cors from 'cors'
import {createServer} from 'http'
import {json as jsonBodyParser} from 'body-parser'
import { Server } from 'net'
import { showPosition } from './position'

const PORT = process.env['RH_PORT'] || 3002;

const app = express();
app.set('port', PORT)
app.use(cors());

// routing
app.get('/position/:rider_id', showPosition);

const server = createServer(app);

export function  startServer(): Server {
    return server.listen(PORT, () => {
        console.log('server listen on port ', PORT);
    });
}