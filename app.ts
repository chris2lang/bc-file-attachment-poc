import express from 'express';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import { Request, Response } from 'express';

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filter to only accept PDF files
const fileFilter = (_: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const PORT = process.env.PORT || 9000;

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Define route for PDF upload and processing
app.post('/upload-pdf', upload.single('pdfFile'), async (req: FileRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No PDF file uploaded or file type not supported' });
      return;
    }

    const filePath = req.file.path;
    const accessToken = req.body.accessToken;
    const baseUrl = req.body.baseUrl;
      const attachmentId = req.body.attachmentId;
      const eTag = req.body.eTag;

    if (!accessToken || !baseUrl || !attachmentId || !eTag) {
      res.status(400).json({ error: 'Some params are missing' });
      return;
    }

    // Read the file as binary data
    const fileBuffer = fs.readFileSync(filePath);

    // Send PATCH request with binary data
    const response = await axios.patch(`${baseUrl}/attachments(${attachmentId})/attachmentContent`, fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        Authorization: `Bearer ${accessToken}`,
        'If-Match': eTag
      }
    });

    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'PDF successfully uploaded and sent via PATCH request',
      response: {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      }
    });
  } catch (error: any) {
    console.error('Error processing the PDF file:', error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process the PDF file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});