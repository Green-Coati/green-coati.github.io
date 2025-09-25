const $ = selector => document.querySelector(selector)

const main = async () => {

    const names = (await (await fetch('assets/other/names.txt')).text()).replaceAll('\r', '').split('\n')

    class monster {
        constructor(type) {
            this.type = type
            this.groanSound = new Audio()
            this.groanSound.src = `assets/sounds/${type}_monster.mp3`
            if (Math.random() > 1) this.name = names[Math.floor(Math.random() * names.length)]
            else this.name = namer()
        }

        groan() {
            this.groanSound.currentTime = 0
            this.groanSound.play()
        }
    }

    const monters = []
    const monterIDs = new Array($('select').children.length - 1).fill('').map((e, index) => $('select').children[index].value)
    let selectedMonster

    $('#create-monster').onclick = () => {
        create($('select').value)
    }

    const create = monsterID => {
        if (monsterID == 'random') monsterID = monterIDs[Math.floor(Math.random() * monterIDs.length)]
        const monst = new monster(monsterID)
        monters.push(monst)
        const monstImg = new Image()
        monstImg.classList.add('creature')
        monstImg.src = `assets/images/${monsterID}.png`
        $('.monsters').appendChild(monstImg)
        monst.groan()
        monstImg.onclick = () => {
            $('#name').textContent = monst.name
            $('.monster-info').style.display = 'flex'
            const monsterImages = Array.from($('.monsters').children)
            const ind = monsterImages.indexOf(monstImg)
            selectedMonster = monst
            $('#monster-image').src = `assets/images/${monsterID}.png`
        }
    }

    $('#change-name').onclick = () => {
        const newName = prompt('what do you want your creatur\'s name to be?')
        selectedMonster.name = newName
        $('#name').textContent = newName
    }

    $('#close').onclick = () => $('.monster-info').style.display = 'none'

    const gameLoop = () => {
        for (let monster of monters) {
            if (monster.groanSound.currentTime == monster.groanSound.duration) {
                monster.groan()
            }
        }
        requestAnimationFrame(gameLoop)
    }
    gameLoop()

    document.addEventListener('keydown', e => {
        if (e.key == 'Escape') $('.monster-info').style.display = 'none'
    })

}

main()