const username = prompt('enter a username')

document.addEventListener('keydown', event => {
    if (event.key == 'Enter') {
        sendMessage()
    }
})

const displayMessage = (data) => {
    const listItem = document.createElement('li')
    const textContainer = document.createElement('div')
    textContainer.classList.add('message')
    listItem.appendChild(textContainer)
    const username = document.createElement('span')
    username.classList.add('user')
    username.textContent = data.user
    textContainer.appendChild(username)
    const messageText = document.createElement('span')
    messageText.classList.add('message-text')
    messageText.textContent = data.content
    textContainer.appendChild(messageText)
    $('.messages').appendChild(listItem)
}