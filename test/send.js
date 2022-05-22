const {createListener, createSpeaker} = require('../lib')

const server = createListener(8000)
const client = createSpeaker()

server.on('test-msg-one', (message, data) => {
    console.log('Message one received', data)
    message.reply('Answer one')
})
server.on('test-msg-two', (message, data) => {
    console.log('Message two received', data)
    message.reply('Answer two')
})

let i = 0
let j = 0
client.connect(8000).then(() => {
    setInterval(() => {
        console.log('Sending one')
        client.send('test-msg-one', 'Data one ' + i++, (data) => {
            console.log('Reply one', data)
        })
    }, 2000)
    setInterval(() => {
        console.log('Sending two')
        client.send('test-msg-two', 'Data two ' + j++, (data) => {
            console.log('Reply two', data)
        })
    }, 3000)
})