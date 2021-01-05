"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const JsonSocket = require("json-socket");
const constants_1 = require("../constants");
const server_1 = require("./server");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/empty");
require("rxjs/add/operator/finally");
const DEFAULT_PORT = 3000;
const MESSAGE_EVENT = 'message';
const ERROR_EVENT = 'error';
class ServerTCP extends server_1.Server {
    constructor(config) {
        super();
        this.port = config.port || DEFAULT_PORT;
        this.init();
    }
    listen(callback) {
        this.server.listen(this.port, callback);
    }
    close() {
        this.server.close();
    }
    bindHandler(socket) {
        const sock = this.getSocketInstance(socket);
        sock.on(MESSAGE_EVENT, async (msg) => await this.handleMessage(sock, msg));
    }
    async handleMessage(socket, msg) {
        const pattern = JSON.stringify(msg.pattern);
        const status = 'error';
        if (!this.messageHandlers[pattern]) {
            return socket.sendMessage({ status, err: constants_1.NO_PATTERN_MESSAGE });
        }
        const handler = this.messageHandlers[pattern];
        const response$ = this.transformToObservable(await handler(msg.data));
        response$ && this.send(response$, socket.sendMessage.bind(socket));
    }
    init() {
        this.server = net.createServer(this.bindHandler.bind(this));
        this.server.on(ERROR_EVENT, this.handleError.bind(this));
    }
    getSocketInstance(socket) {
        return new JsonSocket(socket);
    }
}
exports.ServerTCP = ServerTCP;