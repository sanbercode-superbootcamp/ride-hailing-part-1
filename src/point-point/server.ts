import * as express from 'express';
import * as cors from 'cors';
import { createServer } from 'http';
import { Server } from 'net';
import { json as jsonBodyParser } from 'body-parser';
import { getRiderPoint } from "./pointpoint"

const PORT = process.env['RH_PORT'] || 3002;

const app = express();
app.set('port', PORT);
app.use(cors());
app.get("/points/:rider_id", getRiderPoint);
const server = createServer(app);

export function startServer(): Server {
  return server.listen(PORT, () => {
    console.log('server listen on port ', PORT);
  });
}