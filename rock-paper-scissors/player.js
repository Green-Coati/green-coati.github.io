class Player {

    constructor(type, x, y, xDirection, yDirection, speed) {

        this.type = type
        this.x = x
        this.y = y
        this.xDirection = xDirection
        this.yDirection = yDirection
        this.speed = speed

    }

    advanceFrame(dt) {

        this.x += dt * this.speed * this.xDirection
        this.y += dt * this.speed * this.yDirection

    }

}