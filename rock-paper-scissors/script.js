const $ = selector => document.querySelector(selector)

const ROCK_FILE = 'assets/image/rock.jpg'
const PAPER_FILE = 'assets/image/paper.jpg'
const SCISSORS_FILE = 'assets/image/scissors.jpg'

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

const PLAYERS_PER_TEAM = 30
const SPEED = 25
const IMAGE_WIDTH = WIDTH / 50

const gameCanvas = $('#game-canvas')

gameCanvas.width = WIDTH
gameCanvas.height = HEIGHT

const rockImage = new Image()
rockImage.src = ROCK_FILE
const paperImage = new Image()
paperImage.src = PAPER_FILE
const scissorsImage = new Image()
scissorsImage.src = SCISSORS_FILE

const makeRandomPlayer = type => {
    const x = Math.floor(Math.random() * WIDTH)
    const y = Math.floor(Math.random() * HEIGHT)
    const angle = Math.random() * Math.PI
    return new Player(type, x, y, Math.cos(angle), Math.sin(angle), SPEED)
}

const getImage = player => {
    switch (player.type) {
        case 'rock':
            return rockImage
        case 'paper':
            return paperImage
        case 'scissors':
            return scissorsImage
    }
    return null
}

const isColliding = (player1, player2) => {
    return Math.abs(player1.x - player2.x) < IMAGE_WIDTH && Math.abs(player1.y - player2.y) < IMAGE_WIDTH
}

const getLoserType = (player1, player2) => {
    if (player1.type == player2.type) return null
    if (player1.type === 'rock') {
        if (player2.type === 'paper') return player2.type
        else return player1.type
    } else if (player1.type === 'paper') {
        if (player2.type === 'rock') return player1.type
        else return player2.type
    } else {
        if (player2.type === 'rock') return player2.type
        else return player1.type
    }
}

const bounce = player => {
    if ((player.x <= 0 && player.xDirection <= 0) || (player.x + IMAGE_WIDTH >= WIDTH && player.xDirection >= 0)) player.xDirection *= -1
    if ((player.y <= 0 && player.yDirection <= 0) || (player.y + IMAGE_WIDTH >= HEIGHT && player.yDirection >= 0)) player.yDirection *= -1
}

const ctx = gameCanvas.getContext('2d')

const players = []

for (let i = 0; i < PLAYERS_PER_TEAM; i++) {
    const rock = makeRandomPlayer('rock')
    const paper = makeRandomPlayer('paper')
    const scissors = makeRandomPlayer('scissors')

    players.push(rock, paper, scissors)
}

ctx.fillStyle = 'white'

const draw = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    for (const player of players) {
        const image = getImage(player)
        ctx.drawImage(image, player.x, player.y, IMAGE_WIDTH, IMAGE_WIDTH)
        const dt = (Date.now() - prevFrameTime) / 1000
        player.advanceFrame(dt)
        bounce(player)
    }
    for (let i = 0; i < players.length - 1; i++) {
        for (let j = i; j < players.length; j++) {
            if (isColliding(players[i], players[j])) {
                const loserType = getLoserType(players[i], players[j])
                if (loserType !== null) {
                    players[i].type = loserType
                    players[j].type = loserType
                }
            }
        }
    }
    prevFrameTime = Date.now()
    requestAnimationFrame(draw)
}

let prevFrameTime = Date.now()
draw()
