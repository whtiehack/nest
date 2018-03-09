import * as WebSocket from 'uws';
import { WebSocketAdapter } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

export class UWsAdapter implements WebSocketAdapter {
    constructor(private server){}
    public create(port: number) {
        return new WebSocket.Server({ server:this.server });
    }

    public bindClientConnect(server, callback: (...args: any[]) => void) {
        server.on('connection', callback);
    }

    public bindMessageHandlers(
        client: WebSocket,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>,
    ) {
        client.on('message',async (data)=>{
            const ret :Observable<any> = this.bindMessageHandler(data,handlers,process);
            const result = await ret.toPromise();
            if(!result){
                console.log('not result',data);
                return;
            }
            console.log(`message ${data} result is : ${result}`);
            client.send(result);
        });
        // Observable.fromEvent(client, 'message')
        //   .switchMap(buffer => this.bindMessageHandler(buffer, handlers, process))
        //   .filter(result => !!result)
        //   .subscribe(response => client.send(JSON.stringify(response)));
    }

    public bindMessageHandler(
        buffer,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>,
    ): Observable<any> {
        const data = JSON.parse(buffer);
        const messageHandler = handlers.find(
            handler => handler.message === data.type,
        );
        if (!messageHandler) {
            return Observable.empty();
        }
        const { callback } = messageHandler;
        return process(callback(data));
    }
}
