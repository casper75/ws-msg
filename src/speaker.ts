import net from 'net'
import {MessengerBase, Message} from './base'

const MAX_ID = 9999999

type Address = string|number
interface Socket extends net.Socket {
    uniqueSocketId: string
}
interface Waiters {
    [id: string]: Function
}

export class Speaker extends MessengerBase {
    sockets: Socket[]
    waiters: Waiters
    socketId: number
    messageId: number
    socketIterator: number

    constructor() {
        super()
        this.sockets = []
        this.waiters = {}
        this.socketId = 1
        this.messageId = 1
        this.socketIterator = 0
    }

    multi(...addresses: Address[]): Promise<void[]> {
        const tasks = []
        for(const address of addresses) {
            tasks.push(this.connect(address))
        }
        return Promise.all(tasks)
    }

    connect(address: Address): Promise<void> {
        return new Promise((resolve, reject) => {
            const host = this.getHostByAddress(address)
            const port = this.getPortByAddress(address)
            const socket = new net.Socket as Socket
            const id = this.getNewSocketId()
            socket.setEncoding('utf8')
            socket.setNoDelay(true)
            socket.setMaxListeners(Infinity)
            socket.uniqueSocketId = id
            socket.on('data', data => {
                for (const messageJson of this.tokenizeData(data.toString())) {
                    const message = JSON.parse(messageJson) as Message
                    if (message.id === undefined || this.waiters[message.id] === undefined) continue
                    this.waiters[message.id](message.data)
                    delete this.waiters[message.id]
                }
            })
            socket.on('error', (err) => {
                reject(err)
            })
            socket.on('close', () => {
                let i = 0
                for (const sock of this.sockets) {
                    if (sock.uniqueSocketId === socket.uniqueSocketId) break
                    i++
                }
                this.sockets.splice(i, 1)
                socket.destroy()
                setTimeout(() => {
                    this.connect(address)
                }, 1000)
            })
            socket.connect(port, host, () => {
                this.sockets.push(socket)
                resolve()
            })
        })
    }

    send(subject: string, data: any, callback: Function|undefined) {
        if (this.sockets.length === 0) {
            if (callback !== undefined) callback({error: -1})
            return
        }
        if (this.sockets[this.socketIterator] === undefined) this.socketIterator = 0
        const message = {subject, data} as Message
        if (callback !== undefined) {
            message.id = this.getNewMessageId()
            this.waiters[message.id] = callback
        }
        this.sockets[this.socketIterator++].write(this.prepareJsonToSend(message))
    }

    shout(subject: string, data: any) {
        const message = {subject, data} as Message
        for (const socket of this.sockets) {
            socket.write(this.prepareJsonToSend(message))
        }
    }

    getNewSocketId(): string {
        let newId = this.socketId++
        if (newId > MAX_ID) newId = 1
        return 'id' + newId.toString()
    }

    getNewMessageId(): string {
        let newId = this.messageId++
        if (newId > MAX_ID) newId = 1
        const id = 'id' + newId.toString()
        if (this.waiters[id] !== undefined) delete this.waiters[id]
        return id
    }

}