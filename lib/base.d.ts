/// <reference types="node" />
import net from 'net';
export interface Message {
    id?: string;
    subject?: string;
    data: any;
    conn?: net.Socket;
    reply?: Function;
    next?: Function;
}
export declare class MessengerBase {
    savedBuffer: string;
    constructor();
    getHostByAddress(address: number | string): string;
    getPortByAddress(address: number | string): number;
    prepareJsonToSend(json: Message): string;
    tokenizeData(data: string): string[];
}
