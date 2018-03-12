import { Interceptor, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Interceptor()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    dataOrRequest,
    context: ExecutionContext,
    stream$: Observable<any>,
  ): Observable<any> {
    console.log('Before...',context.handler.name);
    const now = Date.now();

    return stream$.do(() => console.log(`After... ${Date.now() - now}ms ,name:${context.handler.name}`));
  }
}
