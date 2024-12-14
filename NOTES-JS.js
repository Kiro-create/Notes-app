// script.js
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (event) => {
    displayMessage(event.data);
});

document.getElementById('sendButton').addEventListener('click', sendMessage);

function sendMessage() {
    const message = { type: 'greeting', text: 'Hello from the parent window!' };
    const targetOrigin = 'https://your-target-origin.com'; // Replace with the actual target origin
    console.log('Sending message:', message, 'to', targetOrigin);
    window.postMessage(message, targetOrigin);
}

function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

window.addEventListener('message', (event) => {
    if (event.origin !== 'https://your-expected-origin.com') return;
    console.log('Received message:', event.data);
});