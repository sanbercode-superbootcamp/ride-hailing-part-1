import * as express from 'express'
import * as cors from 'cors'
import {createServer} from 'http'
import {json as jsonBodyParser} from 'body-parser'
import { Server } from 'net'

const PORT = process.env['RH_PORT'];

const app = express();
app.set('port', PORT)
app.use(cors());

const server = createServer(app);

export function  startServer(): Server {
    return server.listen(PORT, () => {
        console.log('server listen on port ', PORT);
    });
}