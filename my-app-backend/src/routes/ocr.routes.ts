import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    // Logic for OCR processing...
    const mockExtractedText = "TUNIS 183 TN 24 CHASSIS VF1RFD12345678901"; 
    const plateMatch = mockExtractedText.match(/(\d{2,3})\s?TN\s?(\d{1,4})/);
    const chassisMatch = mockExtractedText.match(/[A-HJ-NPR-Z0-9]{17}/);

    res.json({
      success: true,
      plate: plateMatch ? `${plateMatch[1]} TN ${plateMatch[2]}` : null,
      chassis: chassisMatch ? chassisMatch[0] : null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;