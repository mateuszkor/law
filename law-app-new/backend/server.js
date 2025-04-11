const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 5001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Process question endpoint
app.post('/process-question', (req, res) => {
    const { question } = req.body;

    if (!question?.trim()) {
        return res.status(400).json({ error: 'Question cannot be empty.' });
    }

    const pythonProcess = spawn('python3', ['prawo.py']);
    let result = '';
    let error = '';

    pythonProcess.stdin.write(question);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => result += data.toString());
    pythonProcess.stderr.on('data', (data) => error += data.toString());

    pythonProcess.on('close', (code) => {
        if (code !== 0 || error) {
            console.error('Python error:', error);
            return res.status(500).json({ error: 'Processing failed' });
        }
        res.json({ success: true, answer: result });
    });
});

// PDF upload endpoint
app.post('/upload', (req, res) => {
    try {
        if (!req.files?.pdfFile) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const pdfFile = req.files.pdfFile;
        
        if (!pdfFile.mimetype.includes('pdf')) {
            return res.status(400).json({ error: 'Only PDF files are allowed.' });
        }

        const uploadPath = path.join(__dirname, 'uploads', pdfFile.name);

        pdfFile.mv(uploadPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).json({ error: 'Error saving the file.' });
            }

            res.json({
                success: true,
                fileUrl: `/uploads/${pdfFile.name}`,
                fileName: pdfFile.name,
                fileSize: pdfFile.size,
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error occurred.' });
    }
});

// Health check endpoint
app.get('/', (req, res) => res.send('PDF Viewer API is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
