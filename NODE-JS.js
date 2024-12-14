const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    // Placeholder for file processing logic
    console.log(req.file);
    res.send('File uploaded successfully');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
