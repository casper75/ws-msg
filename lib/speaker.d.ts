/// <reference types="node" />
import net from 'net';
import { MessengerBase } from './base';
declare type Address = string | number;
interface Socket extends net.Socket {
    uniqueSocketId: string;
}
interface Waiters {
    [id: string]: Function;
}
export declare class Speaker extends MessengerBase {
    sockets: Socket[];
    waiters: Waiters;
    socketId: number;
    messageId: number;
    socketIterator: number;
    constructor();
    multi(...addresses: Address[]): Promise<void[]>;
    connect(address: Address): Promise<void>;
    send(subject: string, data: any, callback: Function | undefined): void;
    shout(subject: string, data: any): void;
    getNewSocketId(): string;
    getNewMessageId(): string;
}
export {};
