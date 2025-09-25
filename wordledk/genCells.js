for (let row = 0; row < 6; row++) {
    const rowDiv = document.createElement('div')
    rowDiv.classList.add("row")
    for (let cell = 0; cell < 5; cell++) {
        const cellDiv = document.createElement('div')
        cellDiv.classList.add("cell")
        rowDiv.appendChild(cellDiv)
    }
    document.querySelector('.guess-container').appendChild(rowDiv)
}