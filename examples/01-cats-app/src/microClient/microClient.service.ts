import { Component } from '@nestjs/common';
import {ClientProxy, Transport, Client} from "@nestjs/microservices";

@Component()
export class MicroClientService {
    @Client({ transport: Transport.TCP, port: 3006 })
    public testMicroClient: ClientProxy

}
