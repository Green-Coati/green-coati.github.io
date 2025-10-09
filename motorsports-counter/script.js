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

const digestMessage = async message => {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const validatePassword = async () => {
    const passwordHash = "3d146d150df68e0ea31ce7b72c9f5e2823421eaa7bad50b482b5996f90892a1d";
    const passwordInput = prompt("Please enter the password.");
    const inputHash = await digestMessage(passwordInput);
    if (inputHash != passwordHash) document.body.innerHTML = '';
}

validatePassword();

