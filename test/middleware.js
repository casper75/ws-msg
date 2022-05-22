const {createListener, createSpeaker} = require('../lib')

const server = createListener(8000)
const client = createSpeaker()

let i = 1

server.on('test-msg', (message, data) => {
    if (data.auth) {
        message.data.some = i++
        message.next()
        return
    }
    message.reply('Not authorized')
}, (message, data) => {
    message.reply('Authorized, some = ' + data.some)
})

let auth = true

client.connect(8000).then(() => {
    setInterval(() => {
        console.log('Sending')
        client.send('test-msg', {auth}, (data) => {
            console.log('Reply', data)
        })
        auth = !auth
    }, 2000)
})