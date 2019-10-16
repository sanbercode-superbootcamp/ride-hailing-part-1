import * as express from 'express';
import * as cors from 'cors';
import { createServer } from 'http';
import { track } from './track';
import { json as jsonBodyParser } from 'body-parser';

const PORT = process.env['RH_PORT'];

const app = express();
app.set('port', PORT)
app.use(cors());

// routing
app.post('/track', jsonBodyParser(), track)

const server = createServer(app);

export function startServer() {
    server.listen(PORT, () => {
        console.log('server listen on port', PORT);
    });
}