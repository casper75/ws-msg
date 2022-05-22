import net from 'net'

export interface Message {
    id?: string
    subject?: string
    data: any
    conn?: net.Socket
    reply?: Function
    next?: Function
}

export class MessengerBase {
    savedBuffer: string

    constructor() {
        this.savedBuffer = ''
    }

    getHostByAddress(address: number|string): string {
        if (typeof address == 'string') return address.split(':')[0]
        return '127.0.0.1'
    }

    getPortByAddress(address: number|string): number {
        if (typeof address == 'string') return parseInt(address.split(':')[1])
        return address
    }

    prepareJsonToSend(json: Message): string {
        return JSON.stringify(json) + '\0'
    }
    
    tokenizeData(data: string): string[] {
        this.savedBuffer += data
        const tokens = this.savedBuffer.split('\0')
        if (tokens.pop()) return []
        this.savedBuffer = ''
        return tokens
    }
}
