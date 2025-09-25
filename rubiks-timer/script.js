let startTime = 0
let timerActive = false
let started = false
let plussed = false

const $ = selector => document.querySelector(selector)

if (localStorage['best2']) $('.best2').textContent = localStorage['best2']
if (localStorage['best3']) $('.best3').textContent = localStorage['best3']

document.addEventListener('keyup', event => {
    switch(event.key) {
        case '+':
            if (timerActive || !started || plussed) return
            plussed = true
            const timeStr = $('.timer').textContent
            let mins = timeStr.split(':')[0]
            let secs = (parseInt(timeStr.split(':')[1].split('.')[0]) + 2)
            if (secs >= 60) {
                secs -= 60
                mins++
            }
            secs = '' + secs
            let millis = timeStr.split('.')[1]
            const timerString = mins + ":" + ((secs.length == 1) ? '0' : '') + secs + "." + millis
            $('.timer').textContent = timerString
            break
        case 'r':
            if (timerActive) return
            $('.timer').textContent = '0:00.000'
            started = false
            plussed = false
            break
        case '2':
            if (!started || timerActive || !window.confirm("are you sure?")) return
            localStorage['best2'] = $('.timer').textContent
            $('.best2').textContent = $('.timer').textContent
            break
        case '3':
            if (!started || timerActive || !window.confirm("are you sure?")) return
            localStorage['best3'] = $('.timer').textContent
            $('.best3').textContent = $('.timer').textContent
            break
        case 'Backspace':
            if (!window.confirm("are you sure?")) return
            localStorage.removeItem('best2')
            $('.best2').textContent = '-:--.---'
            break
        case '\\':
            if (!window.confirm("are you sure?")) return
            localStorage.removeItem('best3')
            $('.best3').textContent = '-:--.---'
            break
        case ' ':
            if (started) return
            startTime = Date.now()
            timerActive = true
            started = true
            timer()
            document.addEventListener('keydown', event => {
                if (event.key != 'r') {
                    timerActive = false
                }
            })
            break
    }
})

const timer = () => {
    const dt = Date.now() - startTime
    const mins = '' + Math.floor(dt / 60000)
    const secs = '' + Math.floor((dt / 1000) % 60)
    let millis = '' + Math.floor(1000 * ((dt / 1000) % 1))
    if (millis.length == 1) millis = millis + '00'
    if (millis.length == 2) millis = millis + '0'
    else millis = millis.substring(0, 3)
    const timerString = mins + ":" + ((secs.length == 1) ? '0' : '') + secs + "." + millis
    $('.timer').textContent = timerString
    if (timerActive) requestAnimationFrame(timer)
}