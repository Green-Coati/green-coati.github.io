const $ = selector => document.querySelector(selector)

CanvasRenderingContext2D.prototype.drawImageCentered = function(image, x, y, width, height) {
    this.drawImage(image, x - width / 2, y - height / 2, width, height)
}

const ROCK_FILE = 'assets/image/rock.jpg'
const PAPER_FILE = 'assets/image/paper.jpg'
const SCISSORS_FILE = 'assets/image/scissors.jpg'
const COLLISION_SOUND_FILE = 'assets/sound/vine_boom.mp3'
const BACKGROUND_MUSIC_FILE = 'assets/sound/buddy_holly.mp3'

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

const PLAYERS_PER_TEAM = 30
const SPEED = 25
const IMAGE_WIDTH = HEIGHT / 25

const gameCanvas = $('#game-canvas')

gameCanvas.width = WIDTH
gameCanvas.height = HEIGHT

let mousePos = { x: WIDTH / 2, y: HEIGHT / 2 }
let flashlightOn = false
let dark = false

const rockImage = new Image()
rockImage.src = ROCK_FILE
const paperImage = new Image()
paperImage.src = PAPER_FILE
const scissorsImage = new Image()
scissorsImage.src = SCISSORS_FILE
const flashlightImage = new Image()
flashlightImage.src = 'assets/image/flashlight_cookie.png'

const flickerSound = new Audio('assets/sound/flicker.mp3')
const breakerSound = new Audio('assets/sound/breaker.mp3')
const breathingSound = new Audio('assets/sound/breathing.mp3')
breathingSound.volume = 0.25
const heartbeatSound = new Audio('assets/sound/heartbeat.mp3')
const flashlightSound = new Audio('assets/sound/flashlight_click.mp3')

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
    if ((player.x - IMAGE_WIDTH / 2 <= 0 && player.xDirection <= 0) || (player.x + IMAGE_WIDTH / 2 >= WIDTH && player.xDirection >= 0)) player.xDirection *= -1
    if ((player.y - IMAGE_WIDTH / 2 <= 0 && player.yDirection <= 0) || (player.y + IMAGE_WIDTH / 2 >= HEIGHT && player.yDirection >= 0)) player.yDirection *= -1
}

const getMousePos = event => {
  var rect = gameCanvas.getBoundingClientRect()
  mousePos = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

document.addEventListener('mousemove', getMousePos)

const ctx = gameCanvas.getContext('2d')

const players = []

for (let i = 0; i < PLAYERS_PER_TEAM; i++) {
    const rock = makeRandomPlayer('rock')
    const paper = makeRandomPlayer('paper')
    const scissors = makeRandomPlayer('scissors')

    players.push(rock, paper, scissors)
}

const draw = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    for (const player of players) {
        const image = getImage(player)
        ctx.drawImageCentered(image, player.x, player.y, IMAGE_WIDTH, IMAGE_WIDTH)
        const dt = (Date.now() - prevFrameTime) / 1000
        player.advanceFrame(dt)
        bounce(player)
    }
    for (let i = 0; i < players.length - 1; i++) {
        for (let j = i; j < players.length; j++) {
            if (isColliding(players[i], players[j])) {
                const loserType = getLoserType(players[i], players[j])
                if (loserType !== null) {
                    const collisionSound = new Audio(COLLISION_SOUND_FILE)
                    // collisionSound.play()
                    players[i].type = loserType
                    players[j].type = loserType
                }
            }
        }
    }
    if (dark && !flashlightOn) ctx.fillRect(0, 0, WIDTH, HEIGHT)
    if (flashlightOn) ctx.drawImageCentered(flashlightImage, mousePos.x, mousePos.y, 4096, 4096)
    prevFrameTime = Date.now()
    requestAnimationFrame(draw)
}

const backgroundMusic = new Audio(BACKGROUND_MUSIC_FILE)
console.log(backgroundMusic)
// backgroundMusic.play()
backgroundMusic.addEventListener('ended', function() {
    this.currentTime = 0
    // this.play()
})

const toggleDark = () => {
    dark = !dark
}

const flicker = () => {
    flickerSound.currentTime = 0
    flickerSound.play()
    heartbeatSound.pause()
    breathingSound.pause()
    setTimeout(() => {
        flashlightOn = false
        $('.content').style.cursor = 'default'
        $('h3').style.display = 'none'
        toggleDark()
        setTimeout(() => {
            toggleDark()
            setTimeout(() => {
                toggleDark()
                setTimeout(() => {
                    toggleDark()
                    setTimeout(() => {
                        toggleDark()
                        setTimeout(() => {
                            toggleDark()
                            setTimeout(() => {
                                toggleDark()
                                breakerSound.currentTime = 0
                                breakerSound.play()
                                if (dark) {
                                    $('h3').style.display = 'block'
                                    breathingSound.currentTime = 0
                                    heartbeatSound.currentTime = 0
                                    breathingSound.play()
                                    heartbeatSound.play()
                                    setTimeout(flicker, Math.floor(Math.random() * (15000 - 8000)) + 8000)
                                } else {
                                    flashlightOn = false
                                    $('.content').style.cursor = 'default'
                                    setTimeout(flicker, Math.floor(Math.random() * (45000 - 20000)) + 20000)
                                }
                            }, 600)
                        }, 100)
                    }, 300)
                }, 150)
            }, 300)
        }, 250)
    }, 100)
}

setTimeout(flicker, Math.floor(Math.random() * (45000 - 20000)) + 20000)

document.addEventListener('keypress', event => {
    if (event.key === 'f' && dark) {
        flashlightSound.currentTime = 0
        flashlightSound.play()
        flashlightOn = !flashlightOn
        if (flashlightOn) {
            $('.content').style.cursor = 'none'
            $('h3').style.display = 'none'
        } else {
            $('.content').style.cursor = 'default'
            $('h3').style.display = 'block'
        }
    }
})

let prevFrameTime = Date.now()
draw()