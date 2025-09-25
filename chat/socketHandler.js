const $ = selector => document.querySelector(selector)

const ws = new WebSocket('ws://localhost:11000')

ws.onopen = () => {
    console.log('connected')
}

ws.onmessage = message => {
    const data = JSON.parse(message.data)
    messageHandler[data.type](data)
}

const messageHandler = {
    message: displayMessage
}

const sendMessage = () => {
    const input = $('.message-input')
    const messageText = input.value
    const data = {
        type: 'message',
        user: username,
        content: messageText
    }
    ws.send(JSON.stringify(data))
    input.value = ''
}