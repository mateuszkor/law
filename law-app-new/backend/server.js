const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5001; // Using port 5001 since 5000 had conflicts

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Enable CORS
app.use(cors());

app.use(express.json());

const { spawn } = require('child_process');

// Add this endpoint (before app.listen)
app.post('/process-question', (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim() === '') {
            return res.status(400).json({ error: 'Question cannot be empty.' });
        }

        // Spawn Python process
        const pythonProcess = spawn('python3', ['capitalize.py']);
        
        let result = '';
        let error = '';

        // Send question to Python script
        pythonProcess.stdin.write(question);
        pythonProcess.stdin.end();

        // Collect results
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0 || error) {
                console.error('Python error:', error);
                return res.status(500).json({ error: 'Processing failed' });
            }
            res.json({ success: true, answer: result });
        });

    } catch (error) {
        console.error('Error handling question:', error);
        res.status(500).json({ error: 'Server error occurred.' });
    }
});


// Configure file upload middleware
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    },
}));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle PDF upload
app.post('/upload', (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const pdfFile = req.files.pdfFile;
        
        // Validate file type
        if (!pdfFile.mimetype.includes('pdf')) {
            return res.status(400).json({ error: 'Only PDF files are allowed.' });
        }

        const uploadPath = path.join(__dirname, 'uploads', pdfFile.name);

        // Move the file to the uploads directory
        pdfFile.mv(uploadPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).json({ error: 'Error saving the file.' });
            }

            // Return the URL to access the file
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

// Simple health check endpoint
app.get('/', (req, res) => {
    res.send('PDF Viewer API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
