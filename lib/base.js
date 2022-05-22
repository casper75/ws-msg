"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerBase = void 0;
class MessengerBase {
    constructor() {
        this.savedBuffer = '';
    }
    getHostByAddress(address) {
        if (typeof address == 'string')
            return address.split(':')[0];
        return '127.0.0.1';
    }
    getPortByAddress(address) {
        if (typeof address == 'string')
            return parseInt(address.split(':')[1]);
        return address;
    }
    prepareJsonToSend(json) {
        return JSON.stringify(json) + '\0';
    }
    tokenizeData(data) {
        this.savedBuffer += data;
        const tokens = this.savedBuffer.split('\0');
        if (tokens.pop())
            return [];
        this.savedBuffer = '';
        return tokens;
    }
}
exports.MessengerBase = MessengerBase;
