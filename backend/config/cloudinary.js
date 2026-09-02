import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/['"]/g, '');
const apiKey = process.env.CLOUDINARY_API_KEY?.trim().replace(/['"]/g, '');
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim().replace(/['"]/g, '');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Safe diagnostic log (NO secret values or keys printed)
console.log('☁️  Cloudinary Environment Status:', {
  CLOUDINARY_CLOUD_NAME: cloudName ? 'configured' : 'not configured',
  CLOUDINARY_API_KEY: apiKey ? 'configured' : 'not configured',
  CLOUDINARY_API_SECRET: apiSecret ? 'configured' : 'not configured',
});

export default cloudinary;