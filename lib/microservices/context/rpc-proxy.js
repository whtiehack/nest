"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RpcProxy {
    create(targetCallback, exceptionsHandler) {
        return async (data) => {
            try {
                return await targetCallback(data);
            }
            catch (e) {
                return exceptionsHandler.handle(e);
            }
        };
    }
}
exports.RpcProxy = RpcProxy;
