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
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message) {
        socket.send(message);
        input.value = '';
        displayMessage(`You: ${message}`);
    }
}

function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

window.addEventListener('message', (event) => {
    if (event.origin !== 'https://kiro-create.github.io/Notes-app/') return;
    console.log('Received message:', event.data);
});

// Add error handling to your WebSocket client
socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);
});
