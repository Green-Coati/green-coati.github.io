const $ = selector => document.querySelector(selector)

const moves = ['R', 'U', 'F', 'L', 'D', 'B']
const mods = ['', '\'', '2']

if (localStorage['prevScramble']) $('.scramble').innerHTML = localStorage['prevScramble']

for (const button of document.querySelectorAll('.gen')) {
    button.onclick = function() {
        let scramble = ''
        let prevMove = ''
        switch(this.id) {
            case '2':
                for (let i = 0; i < 10; i++) {
                    let index = Math.floor(Math.random() * 3)
                    while (moves[index] == prevMove) {
                        index = Math.floor(Math.random() * 3)
                    }
                    scramble += moves[index] + mods[Math.floor(Math.random() * 3)] + ' '
                    prevMove = moves[index]
                }
                break
            case '3':
                for (let i = 0; i < 20; i++) {
                    let index = Math.floor(Math.random() * 6)
                    while (moves[index] == prevMove) {
                        index = Math.floor(Math.random() * 6)
                    }
                    scramble += moves[index] + mods[Math.floor(Math.random() * 3)] + ' '
                    prevMove = moves[index]
                }
                break
        }
        localStorage['prevScramble'] = scramble
        $('.scramble').innerHTML = scramble
    }
}