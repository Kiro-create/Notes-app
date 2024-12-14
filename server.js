const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const WebSocket = require('ws');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

async function processWithGeminiAI(text) {
    try {
        const response = await axios.post('https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash-latest:generateContent', {
            // Replace with actual API endpoint and parameters
            text: text,
            apiKey: 'AIzaSyD4dg6MA3_I_hC3E4XluiQCNUi1xP0e-7E'
        });
        return response.data;
    } catch (error) {
        console.error('Error processing with GEMINI AI:', error);
        throw error;
    }
}

app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    if (req.file.mimetype === 'application/pdf') {
        try {
            const data = await pdfParse(dataBuffer);
            const aiResult = await processWithGeminiAI(data.text);
            console.log(aiResult);
            res.send('AI processing completed successfully');
        } catch (err) {
            console.error('PDF parsing error:', err);
            res.status(500).send('Error processing file');
        }
    } else {
        res.status(400).send('Unsupported file type');
    }
});

app.get('/', (req, res) => {
    res.send('Server is working!');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        try {
            console.log('received:', message.toString());
            
            // Use your existing Gemini AI function
            const aiResponse = await processWithGeminiAI(message.toString());
            
            // Send response back to client
            ws.send(JSON.stringify(aiResponse));
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ error: 'Failed to process message' }));
        }
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
