import { MessengerBase, Message } from './base';
interface RemoteMetods {
    [name: string]: Function[];
}
export declare class Listener extends MessengerBase {
    port: number;
    host: string | undefined;
    errorFn: Function;
    remoteMethods: RemoteMetods;
    constructor(address: string | number);
    startServer(): void;
    onError: (errorFn: Function) => void;
    prepare(message: Message): Message;
    dispatch(message: Message): void;
    on(subject: string, ...methods: Function[]): void;
}
export {};
