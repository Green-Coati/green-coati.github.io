const $ = selector => document.querySelector(selector);

$('.logo').onclick = () => {
    window.location.href = 'https://gophermotorsports.com/';
}

const updateNumber = number => {
    $('.tooth-number').innerHTML = number;
}

$('.increment').onclick = () => {
    if (ws.readyState == WebSocket.CLOSED) {
        ws = new WebSocket('wss://websocket-1025317924419.us-central1.run.app');
    }
    ws.send(JSON.stringify({
        type: 'inc'
    }));
}

$('.decrement').onclick = () => {
    if (ws.readyState == WebSocket.CLOSED) {
        ws = new WebSocket('wss://websocket-1025317924419.us-central1.run.app');
    }
    ws.send(JSON.stringify({
        type: 'dec'
    }));
}

const ws = new WebSocket('wss://websocket-1025317924419.us-central1.run.app');

ws.onmessage = message => {
    const data = JSON.parse(message.data);
    if (data.type == 'number') {
        updateNumber(data.number);
    }
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
