"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const JsonSocket = require("json-socket");
const client_proxy_1 = require("./client-proxy");
const common_1 = require("@nestjs/common");
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';
const CONNECT_EVENT = 'connect';
const MESSAGE_EVENT = 'message';
const ERROR_EVENT = 'error';
const CLOSE_EVENT = 'close';
class ClientTCP extends client_proxy_1.ClientProxy {
    constructor({ port, host }) {
        super();
        this.logger = new common_1.Logger(ClientTCP.name);
        this.isConnected = false;
        this.port = port || DEFAULT_PORT;
        this.host = host || DEFAULT_HOST;
    }
    init(callback) {
        this.socket = this.createSocket();
        return new Promise(resolve => {
            this.bindEvents(this.socket, callback);
            this.socket.on(CONNECT_EVENT, () => {
                this.isConnected = true;
                resolve(this.socket);
            });
            this.socket.connect(this.port, this.host);
        });
    }
    async sendSingleMessage(msg, callback) {
        const sendMessage = socket => {
            socket.sendMessage(msg);
            socket.on(MESSAGE_EVENT, buffer => this.handleResponse(socket, callback, buffer));
        };
        if (this.isConnected) {
            sendMessage(this.socket);
            return Promise.resolve();
        }
        const socket = await this.init(callback);
        sendMessage(socket);
    }
    handleResponse(socket, callback, buffer) {
        const { err, response, disposed } = buffer;
        if (disposed || err) {
            callback(err, null, true);
            return socket.end();
        }
        callback(err, response);
    }
    createSocket() {
        return new JsonSocket(new net.Socket());
    }
    close() {
        this.socket && this.socket.end();
        this.isConnected = false;
        this.socket = null;
    }
    bindEvents(socket, callback) {
        socket.on(ERROR_EVENT, err => {
            if (err.code === 'ECONNREFUSED') {
                callback(err, null);
            }
            this.logger.error(err);
        });
        socket.on(CLOSE_EVENT, () => {
            this.isConnected = false;
            this.socket = null;
        });
    }
}
exports.ClientTCP = ClientTCP;
