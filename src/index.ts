import {Listener} from './listener'
import {Speaker} from './speaker'

export function createListener(address: string|number) {
    return new Listener(address)
}

export function createSpeaker() {
    return new Speaker()
}