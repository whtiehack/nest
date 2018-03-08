import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('events')
  onEvent(client, data): Observable<WsResponse<number>> {
    const event = 'events';
    const response = [1, 2, 3];

    return Observable.from(response).map(res => ({ event, data: res }));
  }
  @SubscribeMessage('testAsync')
  async onTestAsync(client,data){
      console.log('clinet',client);
    console.log('~~ test async',data);
    await new Promise(resolve=>setTimeout(resolve,2000));
    return {event:'testAsync',data:data};
  }
}
