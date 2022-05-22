import net from 'net'
import {MessengerBase, Message} from './base'

interface RemoteMetods {
    [name: string]: Function[]
}

export class Listener extends MessengerBase {
    port: number
    host: string|undefined
    errorFn: Function
    remoteMethods: RemoteMetods

    constructor(address: string|number) {
        super()
        this.remoteMethods = {}
        this.port = this.getPortByAddress(address)
        this.host = this.getHostByAddress(address)
        this.errorFn = () => {
            return this.startServer()
        }
        this.startServer()
    }

    startServer() {
        const tcpServer = net.createServer(connection => {
            return connection.on('data', data => {
                for (const messageJson of this.tokenizeData(data.toString())) {
                    const message = JSON.parse(messageJson) as Message
                    message.conn = connection
                    this.dispatch(this.prepare(message))
                }
            })
        })
        tcpServer.listen(this.port, this.host)
        tcpServer.setMaxListeners(Infinity)
        tcpServer.on('error', (err) => {
            return this.errorFn(err)
        })
    }

    onError = (errorFn: Function) => {
        this.errorFn = errorFn
    }

    prepare(message: Message) {
        const subject = message.subject
        let i:number = 0
        message.reply = (data: any) => {
            if (message.conn === undefined) return
            message.conn.write(this.prepareJsonToSend({
                id: message.id,
                data
            }))
        }
        message.next = () => {
            if (subject === undefined) return message
            const ref = this.remoteMethods[subject]
            if (ref !== undefined) {
                ref[i++](message, message.data)
            }
        }
        return message
    }

    dispatch(message: Message) {
        if (message.next === undefined) return
        // const subject = message.subject
        message.next()
    }

    on(subject: string, ...methods: Function[]) {
        this.remoteMethods[subject] = methods
    }
}