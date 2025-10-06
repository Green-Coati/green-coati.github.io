const $ = selector => document.querySelector(selector)

$('.logo').onclick = () => {
    window.location.href = 'https://gophermotorsports.com/'
}

const updateNumber = (number) => {
    $('.tooth-number').innerHTML = number
}

let teethManufactured = parseInt(localStorage['teethNumber'] || '0')
updateNumber(teethManufactured)

$('.increment').onclick = () => {
    teethManufactured++
    localStorage['teethNumber'] = teethManufactured
    updateNumber(teethManufactured)
}

$('.decrement').onclick = () => {
    if (teethManufactured == 0) return
    teethManufactured--
    localStorage['teethNumber'] = teethManufactured
    updateNumber(teethManufactured)
}