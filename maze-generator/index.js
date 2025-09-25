const http = require('http')
const fs = require('fs')

const port = 8080
const host = 'localhost'

http.createServer((req, res) => {
    switch (req.url) {
        case '/script.js':
            res.writeHead(200, {"Content-Type": 'text/javascript'})
            fs.readFile('script.js', (err, data) => {
                if (err) {
                    res.end(err)
                }
                res.end(data)
            })
            break
        case '/style.css':
            res.writeHead(200, {"Content-Type": 'text/css'})
            fs.readFile('style.css', (err, data) => {
                if (err) {
                    res.end(err)
                }
                res.end(data)
            })
            break
        default:
            res.writeHead(200, {"Content-Type": 'text/html'})
            fs.readFile('index.html', (err, data) => {
                if (err) {
                    res.end(err)
                }
                res.end(data)
            })
            break
    }
}).listen(port, host, () => console.log(`Listening on ${host}:${port}!`))