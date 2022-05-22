"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
const net_1 = __importDefault(require("net"));
const base_1 = require("./base");
class Listener extends base_1.MessengerBase {
    constructor(address) {
        super();
        this.onError = (errorFn) => {
            this.errorFn = errorFn;
        };
        this.remoteMethods = {};
        this.port = this.getPortByAddress(address);
        this.host = this.getHostByAddress(address);
        this.errorFn = () => {
            return this.startServer();
        };
        this.startServer();
    }
    startServer() {
        const tcpServer = net_1.default.createServer(connection => {
            return connection.on('data', data => {
                for (const messageJson of this.tokenizeData(data.toString())) {
                    const message = JSON.parse(messageJson);
                    message.conn = connection;
                    this.dispatch(this.prepare(message));
                }
            });
        });
        tcpServer.listen(this.port, this.host);
        tcpServer.setMaxListeners(Infinity);
        tcpServer.on('error', (err) => {
            return this.errorFn(err);
        });
    }
    prepare(message) {
        const subject = message.subject;
        let i = 0;
        message.reply = (data) => {
            if (message.conn === undefined)
                return;
            message.conn.write(this.prepareJsonToSend({
                id: message.id,
                data
            }));
        };
        message.next = () => {
            if (subject === undefined)
                return message;
            const ref = this.remoteMethods[subject];
            if (ref !== undefined) {
                ref[i++](message, message.data);
            }
        };
        return message;
    }
    dispatch(message) {
        if (message.next === undefined)
            return;
        // const subject = message.subject
        message.next();
    }
    on(subject, ...methods) {
        this.remoteMethods[subject] = methods;
    }
}
exports.Listener = Listener;
