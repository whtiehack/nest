import { NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import * as path from "path";
import * as express from 'express';
import {WsAdapter} from "./common/adapters/ws-adapter";
import * as http from 'http';
import {INestApplication} from "@nestjs/common";
import {UWsAdapter} from "./common/adapters/uws-adapter";

async function bootstrap() {
    const instance = express();
    const app:INestApplication = await NestFactory.create(ApplicationModule,instance as any);
    const server = http.createServer(instance);
    app.use('/public', express.static(path.join(__dirname, '../', 'client')));
   // app.useWebSocketAdapter(new WsAdapter(server));
    app.useWebSocketAdapter(new UWsAdapter(server));
    await app.init();
  //  await app.listen(3000);
    server.listen(3000,()=>{console.log('http://127.0.0.1:3000')});
}

bootstrap();
