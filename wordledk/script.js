const $ = selector => document.querySelector(selector)

const main = async (randomWord, lang) => {

    let typingRow = 0
    let typingCell = 0

    const getWord = row => {
        let word = ''
        for (const child of $('.guess-container').children[row].children) {
            word += child.innerHTML
        }
        return word.toLowerCase()
    }

    String.prototype.occurences = function(substring) {
        if (substring.length > this.length) return 0
        let numOccurs = 0
        for (let i = 0; i <= this.length - substring.length; i++) {
            if (this.substring(i,i+substring.length) == substring) numOccurs++
        }
        return numOccurs
    }

    const keyDown = async event => {
        const key = event.key
        if (key == 'Enter') {
            const word = getWord(typingRow)
            const cells = $('.guess-container').children[typingRow].children
            const isValid = await (await fetch('isValid?lang=' + lang + '&word=' + encodeURIComponent(word))).text()
            if (!(isValid == 'true')) return;
            const usedLetters = {}
            let correct = 0
            for (let i = 0; i < word.length; i++) {
                const letter = word.charAt(i)
                if (usedLetters[letter]) usedLetters[letter]++
                else usedLetters[letter] = 1
                if (letter == randomWord.charAt(i)) {
                    cells[i].style.backgroundColor = 'green'
                    findInKeyboard(letter).style.backgroundColor = 'green'
                    correct++
                } else if (usedLetters[letter] <= randomWord.occurences(letter)) {
                    cells[i].style.backgroundColor = 'gold'
                    const key = findInKeyboard(letter)
                    if (key.style.backgroundColor != 'green') {
                        key.style.backgroundColor = 'gold'
                    }
                } else {
                    const key = findInKeyboard(letter)
                    if (key.style.backgroundColor != 'green' && key.style.backgroundColor != 'gold') {
                        key.style.backgroundColor = '#444444'
                    }
                }
            }
            
            if (correct == 5) {
                for (const textbox of document.querySelectorAll('.word')) {
                    textbox.textContent = randomWord
                }
                $('.result-container').style.visibility = 'visible'
                $('.win').style.display = 'flex'
                document.removeEventListener('keydown', keyDown)
                return
            }
            if (typingRow < 5) {
                typingRow++
                typingCell = 0
            } else {
                for (const textbox of document.querySelectorAll('.word')) {
                    textbox.textContent = randomWord
                }
                $('.result-container').style.visibility = 'visible'
                $('.lose').style.display = 'flex'
                document.removeEventListener('keydown', keyDown)
                return
            }
        } else if (key == 'Backspace') {
            if (typingCell != 0) {
                typingCell--
                $('.guess-container').children[typingRow].children[typingCell].innerHTML = ''
            }
        } else if (key.length == 1 && key.match(/[a-z\u00e5\u00e6\u00f8]/g) != null && typingCell < 5) {
            $('.guess-container').children[typingRow].children[typingCell].innerHTML = key.toUpperCase()
            typingCell++
        }
    }

    document.addEventListener('keydown', keyDown)
    for (const row of $('.keyboard').children) {
        for (const cell of row.children) {
            cell.onclick = function() {
                const key = (this.innerHTML .length == 1) ? this.innerHTML .toLowerCase() : this.innerHTML
                keyDown({key: key})
            }
        }
    }
}

$('#da').onclick = async function() {
    $('.language-container').style.visibility = 'hidden'
    $('.lose-message').innerHTML = 'Du tabte!'
    $('.win-message').innerHTML = 'Du vandt!'
    for (const button of document.querySelectorAll('.restart')) {
        button.innerHTML = 'Spil igen'
    }
    const keyboard = $('.keyboard')
    keyboard.children[1].children[9].innerHTML = 'Æ'
    keyboard.children[1].children[10].innerHTML = 'Ø'
    keyboard.style.visibility = 'visible'
    const word = decodeURIComponent(await (await fetch('word?lang=' + this.id)).text())
    main(word, this.id)
}

$('#no').onclick = async function() {
    $('.language-container').style.visibility = 'hidden'
    $('.lose-message').innerHTML = 'Du tapte!'
    $('.win-message').innerHTML = 'Du vant!'
    for (const button of document.querySelectorAll('.restart')) {
        button.innerHTML = 'Spill igjen'
    }
    const keyboard = $('.keyboard')
    keyboard.children[1].children[9].innerHTML = 'Ø'
    keyboard.children[1].children[10].innerHTML = 'Æ'
    keyboard.style.visibility = 'visible'
    const word = decodeURIComponent(await (await fetch('word?lang=' + this.id)).text())
    main(word, this.id)
}

const findInKeyboard = key => {
    for (const row of $('.keyboard').children) {
        for (const cell of row.children) {
            if (key == cell.innerHTML.toLowerCase()) {
                return cell
            }
        }
    }
    return null
}