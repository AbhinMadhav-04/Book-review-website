// src/api/cloudinary.js
// Utility to upload images to Cloudinary anonymously (unsigned upload)
// You must set your Cloudinary cloud name and unsigned upload preset

const CLOUD_NAME = "YOUR_CLOUD_NAME"; // <-- replace with your Cloudinary cloud name
const UPLOAD_PRESET = "YOUR_UNSIGNED_PRESET"; // <-- replace with your unsigned upload preset

export async function uploadImageToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  const data = await res.json();
  return data.secure_url; // The hosted image URL
}
