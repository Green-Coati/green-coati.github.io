const fs = require('fs')

let outputString = 'const words_no = ['

fs.readFile('../wordledk/words_no.txt', 'utf-8', (err, data) => {
    if (err) console.log(err)
    const words = data.split('\n')
    for (let i = 0; i < words.length - 1; i++) {
        outputString += '\'' + words[i] + '\','
    }
    outputString += '\'' + words[words.length - 1] + '\']'
    fs.writeFile('words_no.js', outputString, err => {
        if (err) console.log(err)
    })
})