// src/services/ImageService.js
const uploadImageToCloudinary = async (file) => {
  if (!file) return null;
  
  //Thay bằng thông tin của cloud
  const cloudName = 'dziv0smju';
  const uploadPreset = 'images'; 
  
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error('Image upload failed: ' + text);
    }

    const data = await res.json();
    return data.secure_url || data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export default { uploadImageToCloudinary };