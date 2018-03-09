import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import {MicroClientService} from "./microClient.service";

@Module({
    imports: [],
    components:[MicroClientService],
    exports:[MicroClientService]
})
export class MicroClientModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        // consumer
        //     .apply(LoggerMiddleware)
        //     .with('ApplicationModule')
        //     .forRoutes(CatsController);
    }
}
