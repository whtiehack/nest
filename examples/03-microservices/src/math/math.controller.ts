import {Controller, Get, UseFilters, UseInterceptors} from '@nestjs/common';
import {
    ClientProxy,
    Client,
    Transport,
    MessagePattern, RpcException,
} from '@nestjs/microservices';
import { Observable } from 'rxjs/Observable';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import {ExceptionFilter} from "../common/filters/rpc-exception.filter";
import 'rxjs/add/observable/from';
@Controller()
@UseInterceptors(LoggingInterceptor)
@UseFilters(new ExceptionFilter())
export class MathController {
  @Client({ transport: Transport.TCP })
  client: ClientProxy;

  @Get()
  call(): Observable<number> {
    const pattern = { cmd: 'sum' };
    const data = [1, 2, 3, 4, 5];
    return this.client.send<number>(pattern, data);
  }

  @MessagePattern({ cmd: 'sum' })
  sum(data: number[]): number {
  //  throw new RpcException('~~server error~');
    return (data || []).reduce((a, b) => a + b);
  }

    @MessagePattern({ cmd: 'sum2' })
    sum2(data: number[]) {
        return Observable.from([1, 2, 3]);
    }

    @MessagePattern({ cmd: 'binary' })
    binary(data: number[]): string {
        return new Buffer(data).toString();
    }
}
