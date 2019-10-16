import * as express from 'express';
import * as cors from 'cors';
import { createServer } from 'http';
import { Server } from 'net';
import { json as jsonBodyParser } from 'body-parser';
import { getScore } from './score.service';

const PORT = process.env['RH_PORT'] || 3002;

const app = express();
app.set('port', PORT);
app.use(cors());

app.get('/score/:rider_id', getScore);


const server = createServer(app);

export function startServer(): Server {
  return server.listen(PORT, () => {
    console.log('server listen on port ', PORT);
  });
}