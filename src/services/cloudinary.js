// Cloudinary Image Upload Service for OTTMoneySaver Admin Panel

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zb2ddkdd';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

/**
 * Upload an image file to Cloudinary
 * @param {File} file - File object from input
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<{url: string, public_id: string, bytes: number, format: string}>}
 */
export async function uploadToCloudinary(file, folder = 'ottmoneysaver') {
  if (!file) throw new Error('No file provided for upload.');

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary Upload Error Details:', errorText);
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      public_id: data.public_id,
      bytes: data.bytes,
      format: data.format,
      width: data.width,
      height: data.height
    };
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    throw err;
  }
}

/**
 * Helper to generate responsive Cloudinary thumbnail URL
 */
export function getOptimizedImageUrl(url, width = 600, quality = 'auto') {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  // Insert transformations into Cloudinary URL
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_${quality}/`);
}
