const http = require('http')
const fs = require('fs')
const MimeTypes = require('mime-types')

const host = 'localhost'
const port = 8080

const words = {}
fs.readFile('words_da.txt', 'utf-8', (err, data) => {
    if (err) { console.log(err) }
    words['da'] = data.split('\n')
})
fs.readFile('words_no.txt', 'utf-8', (err, data) => {
    if (err) { console.log(err) }
    words['no'] = data.split('\n')
})

http.createServer((req, res) => {
    if (req.url === '/') {
    fs.readFile('index.html', (err, data) => {
        if (err) {
            console.log(err)
        }
            res.writeHead(200, { 'Content-Type' : 'text/html' })
            res.end(data)
        })
    } else if (req.url.startsWith('/word')) {
        const params = req.url.split('?')[1]
        if (params.split('=')[0] == 'lang' && (params.split('=')[1] == 'da' || params.split('=')[1] == 'no')) {
            const wordlist = words[params.split('=')[1]]
            const word = wordlist[Math.floor(Math.random() * wordlist.length)]
            res.writeHead(200, { 'Content-Type' : 'text/plain' })
            res.end(encodeURIComponent(word))
        } else {
            res.writeHead(404, { 'Content-Type ' : 'text/plain' })
            res.end('Invalid URL')
        }
    } else if (req.url.startsWith('/isValid')) {
        const params = req.url.split('?')[1].split('&')
        if (params[0].split('=')[0] == 'lang' && (params[0].split('=')[1] == 'da' || params[0].split('=')[1] == 'no') && params[1].split('=')[0] == 'word') {
            const wordlist = words[params[0].split('=')[1]]
            const isValid = wordlist.includes(decodeURIComponent(params[1].split('=')[1]))
            res.writeHead(200, { 'Content-Type' : 'text/plain' })
            res.end('' + isValid)
        } else {
            res.writeHead(404, { 'Content-Type ' : 'text/plain' })
            res.end('Invalid URL')
        }
    } else {
    const filepath = req.url.substring(1)
        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.error(`Failed to read file: ${err}`)
                res.writeHead(404, { 'Content-Type' : 'text/plain' })
                res.end('File not found')
            } else {
                const contentType = MimeTypes.lookup(filepath) || 'application/octet-stream'
                res.writeHead(200, { 'Content-Type' : contentType })
                res.end(data);
            }
        })
    }
}).listen(port, host, () => console.log(`Listening on ${host}:${port}!`))