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
