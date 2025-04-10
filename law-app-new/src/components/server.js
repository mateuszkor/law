// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for your React app
app.use(cors());

// Configure express-fileupload
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
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const pdfFile = req.files.pdfFile;
  const uploadPath = path.join(__dirname, 'uploads', pdfFile.name);

  // Move the file to the uploads directory
  pdfFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Return the URL to access the file
    res.json({
      success: true,
      fileUrl: `/uploads/${pdfFile.name}`,
      fileName: pdfFile.name,
      fileSize: pdfFile.size,
      uploadDate: new Date().toISOString()
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
