// Cloudinary Primary Image Upload Service for OTTMoneySaver Admin Panel

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zb2ddkdd';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

/**
 * Upload an image file to Cloudinary as the primary image storage.
 * @param {File} file - Image File object from file input
 * @param {string} folder - Optional folder path in Cloudinary
 * @returns {Promise<{url: string, public_id: string, bytes: number, format: string, width: number, height: number}>}
 */
export async function uploadToCloudinary(file, folder = 'ottmoneysaver') {
  if (!file) {
    throw new Error('No image file selected for upload.');
  }

  // Validate image file type
  if (file.type && !file.type.startsWith('image/')) {
    throw new Error(`Invalid file type (${file.type}). Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).`);
  }

  // Validate maximum file size (10MB limit)
  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image size is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  let lastErrorMessage = '';

  // 1st Attempt: Unsigned upload with folder parameter
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(endpoint, { method: 'POST', body: formData });
    if (response.ok) {
      const data = await response.json();
      return {
        url: data.secure_url,
        public_id: data.public_id,
        bytes: data.bytes,
        format: data.format,
        width: data.width,
        height: data.height
      };
    } else {
      const errJson = await response.json().catch(() => ({}));
      lastErrorMessage = errJson.error?.message || response.statusText;
    }
  } catch (err) {
    console.warn('Cloudinary upload attempt 1 error:', err);
    lastErrorMessage = err.message || 'Network connectivity error';
  }

  // 2nd Attempt: Unsigned upload without folder parameter (some unsigned presets restrict custom folders)
  try {
    const formDataNoFolder = new FormData();
    formDataNoFolder.append('file', file);
    formDataNoFolder.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response2 = await fetch(endpoint, { method: 'POST', body: formDataNoFolder });
    if (response2.ok) {
      const data = await response2.json();
      return {
        url: data.secure_url,
        public_id: data.public_id,
        bytes: data.bytes,
        format: data.format,
        width: data.width,
        height: data.height
      };
    } else {
      const errJson2 = await response2.json().catch(() => ({}));
      lastErrorMessage = errJson2.error?.message || response2.statusText;
    }
  } catch (err) {
    console.warn('Cloudinary upload attempt 2 error:', err);
    lastErrorMessage = err.message || 'Network connectivity error';
  }

  // Throw clear, detailed user-facing error explaining why Cloudinary upload failed
  throw new Error(`Cloudinary Image Upload Failed: ${lastErrorMessage}. Please check your Cloudinary upload preset ("${CLOUDINARY_UPLOAD_PRESET}") and cloud name ("${CLOUDINARY_CLOUD_NAME}").`);
}

/**
 * Helper to generate responsive Cloudinary thumbnail URL with automatic optimization
 */
export function getOptimizedImageUrl(url, width = 600, quality = 'auto') {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_${quality}/`);
}
