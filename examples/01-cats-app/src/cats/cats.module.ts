import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import {MicroClientModule} from "../microClient/microClient.module";

@Module({
    imports:[MicroClientModule],
  controllers: [CatsController],
  components: [CatsService],
})
export class CatsModule {}

@Module({

})
export  class CatsModuleA {}
