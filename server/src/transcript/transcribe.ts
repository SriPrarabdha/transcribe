import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'video/mp4'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and video files are allowed.'));
    }
  }
}).single('file');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const transcribeAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    
    const transcript = await openai.createTranscription(
      fs.createReadStream(filePath) as any,
      "whisper-1"
    );

    // Delete the file after transcription
    fs.unlinkSync(filePath);

    res.json({ 
      success: true, 
      transcript: transcript.data.text 
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error processing transcription' 
    });
  }
};
