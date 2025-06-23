import multer from 'multer';

const storage = multer.memoryStorage(); // Keep file in buffer
const upload = multer({ storage });

export default upload;
