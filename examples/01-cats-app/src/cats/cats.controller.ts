import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    ReflectMetadata,
    UseInterceptors,
    Param, UseFilters,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import {MicroClientService} from "../microClient/microClient.service";
//import {ExceptionFilter} from "../common/filters/rpc-exception.filter";
import 'rxjs/add/operator/do';

@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor, TransformInterceptor)

export class CatsController {
  constructor(private readonly catsService: CatsService,private readonly microClientService:MicroClientService) {}

  @Post()
  @Roles('admin')
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get('/micro')
  async testMicroService(){
    const result = await this.microClientService.testMicroClient.send<number>({cmd:'sum'},[1,2,3,4,5]).toPromise();
    return result;
  }

    @Get('/micro2')
    async testMicroService2(){
        const result = await this.microClientService.testMicroClient.send<number>({cmd:'sum2'},[1,2,3,4,5]);
        return result;
    }

    @Get('/microBuffer')
    testBufferMicroService(){
        // const result = await this.microClientService.testMicroClient.send<number>({cmd:'binary1'},[1,2,3,4,5]).toPromise();
        // return result;
        return this.microClientService.testMicroClient.send<number>({cmd:'binary1'},[1,2,3,4,5]).do(val=>console.log('val:',val),error=>console.log('error',error));
    }

  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe())
    id,
  ) {
    // logic
  }
}
