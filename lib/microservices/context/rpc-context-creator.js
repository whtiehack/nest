"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@nestjs/common/constants");
const constants_2 = require("@nestjs/core/guards/constants");
const index_1 = require("../index");
class RpcContextCreator {
    constructor(rpcProxy, exceptionFiltersContext, pipesCreator, pipesConsumer, guardsContextCreator, guardsConsumer, interceptorsContextCreator, interceptorsConsumer) {
        this.rpcProxy = rpcProxy;
        this.exceptionFiltersContext = exceptionFiltersContext;
        this.pipesCreator = pipesCreator;
        this.pipesConsumer = pipesConsumer;
        this.guardsContextCreator = guardsContextCreator;
        this.guardsConsumer = guardsConsumer;
        this.interceptorsContextCreator = interceptorsContextCreator;
        this.interceptorsConsumer = interceptorsConsumer;
    }
    create(instance, callback, module) {
        const exceptionHandler = this.exceptionFiltersContext.create(instance, callback);
        const pipes = this.pipesCreator.create(instance, callback);
        const guards = this.guardsContextCreator.create(instance, callback, module);
        const metatype = this.getDataMetatype(instance, callback);
        const interceptors = this.interceptorsContextCreator.create(instance, callback, module);
        return this.rpcProxy.create(async (data) => {
            const canActivate = await this.guardsConsumer.tryActivate(guards, data, instance, callback);
            if (!canActivate) {
                throw new index_1.RpcException(constants_2.FORBIDDEN_MESSAGE);
            }
            const handler = async () => {
                const result = await this.pipesConsumer.applyPipes(data, { metatype }, pipes);
                return callback.call(instance, result);
            };
            return await this.interceptorsConsumer.intercept(interceptors, data, instance, callback, handler);
        }, exceptionHandler);
    }
    reflectCallbackParamtypes(instance, callback) {
        return Reflect.getMetadata(constants_1.PARAMTYPES_METADATA, instance, callback.name);
    }
    getDataMetatype(instance, callback) {
        const paramtypes = this.reflectCallbackParamtypes(instance, callback);
        return paramtypes && paramtypes.length ? paramtypes[0] : null;
    }
}
exports.RpcContextCreator = RpcContextCreator;
