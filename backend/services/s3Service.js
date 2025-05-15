const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

let s3;
let useS3 = false;

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_BUCKET_NAME) {
  s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });
  useS3 = true;
}

async function uploadFile(file) {
  if (!useS3) {
    console.warn('AWS S3 no está configurado. Se omite la subida.');
    return { key: '' };
  }

  const key = `productos/${Date.now()}-${file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  await s3.send(command);

  return {
    key: key  // Retornamos solo la key, no la URL
  };
}

module.exports = { uploadFile };
