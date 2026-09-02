import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (fileBuffer, folder = 'learnova') => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/['"]/g, '');
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim().replace(/['"]/g, '');
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim().replace(/['"]/g, '');

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing or not configured.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          const safeErrorLog = {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
            error_details: error.error || error.error?.message,
            headers: error.headers || error.response?.headers,
            x_cld_error: error.headers?.['x-cld-error'] || error.response?.headers?.['x-cld-error'],
            all_keys: Object.getOwnPropertyNames(error),
          };
          console.error('🔴 Cloudinary Upload Error Safe Dump:', JSON.stringify(safeErrorLog, null, 2));
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Diagnostic helper to test Cloudinary API connection and ONE test upload safely
 */
export const testCloudinaryConnection = async () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim().replace(/['"]/g, '');
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim().replace(/['"]/g, '');
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim().replace(/['"]/g, '');

  console.log('☁️  Cloudinary Environment Verification:');
  console.log(`- cloud name configured: ${cloudName ? 'YES' : 'NO'}`);
  console.log(`- API key configured: ${apiKey ? 'YES' : 'NO'}`);
  console.log(`- API secret configured: ${apiSecret ? 'YES' : 'NO'}`);

  try {
    const pingResult = await cloudinary.api.ping();
    console.log(`☁️  Cloudinary API Ping Response: ${pingResult?.status || 'ok'}`);
  } catch (err) {
    console.error('☁️  Cloudinary API Ping Failed:', {
      message: err.message,
      http_code: err.http_code,
      name: err.name,
    });
  }

  // Perform ONE test upload with a 1x1 transparent PNG buffer to capture exact upload response
  console.log('🧪 Performing ONE authenticated Cloudinary upload test...');
  const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

  try {
    const testUrl = await uploadToCloudinary(testBuffer, 'test_diagnostics');
    console.log('✅ Cloudinary Test Upload SUCCESSFUL!');
    return { success: true, url: testUrl };
  } catch (err) {
    console.error('❌ Cloudinary Test Upload FAILED!');
    return { success: false, error: err };
  }
};
