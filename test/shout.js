const {createListener, createSpeaker} = require('../lib')

const server1 = createListener(8001)
const server2 = createListener(8002)
const server3 = createListener(8003)
const server4 = createListener(8004)
const client = createSpeaker()

server1.on('test-msg', (message, data) => {
    console.log('Message received, server 1 ', data)
})
server2.on('test-msg', (message, data) => {
    console.log('Message received, server 2 ', data)
})
server3.on('test-msg', (message, data) => {
    console.log('Message received, server 3 ', data)
})
server4.on('test-msg', (message, data) => {
    console.log('Message received, server 4 ', data)
})

client.multi(8001, 8002, 8003, 8004).then(() => {
    setInterval(() => {
        console.log('Sending')
        client.shout('test-msg', 'Data')
    }, 3000)
})