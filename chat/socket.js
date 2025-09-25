const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 11000 })

console.log('websocket server listening on ws://localhost:11000')

const connections = []

wss.on('connection', ws => {
  console.log('client connected')
  connections.push(ws)

  ws.on('message', message => {
    const data = JSON.parse(message)
    messageHandler[data.type](data)
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
  
})

const broadcastMessage = (data) => {
  for (const connection of connections) {
    connection.send(JSON.stringify(data))
  }
}

const messageHandler = {
  message: broadcastMessage
}

const http = require('http')
const fs = require('fs')
const MimeTypes = require('mime-types')

const host = 'localhost'
const port = 8080

http.createServer((req, res) => {
    if (req.url === '/') {
      fs.readFile('index.html', (err, data) => {
        if (err) {
          console.log(err)
        }
        res.writeHead(200, { 'Content-Type' : 'text/html' })
        res.end(data)
      })
    } else {
        const filepath = req.url.substring(1)
        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.error(`Failed to read file: ${err}`)
                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.end('File not found')
            } else {
                const contentType = MimeTypes.lookup(filepath) || 'application/octet-stream'
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(data);
            }
        })
    }
}).listen(port, host, () => console.log(`Listening on ${host}:${port}!`))