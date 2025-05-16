// backend/scripts/s3BackupRestore.js
const fs = require('fs');
const path = require('path');
const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { pipeline } = require('stream');
const { promisify } = require('util');
require('dotenv').config();

const pipelineAsync = promisify(pipeline);

const ORIGINAL_BUCKET = 'lab09mallcco';
const BACKUP_BUCKET = 'lab09mallccobackup';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function backupAndRestore() {
  try {
    const listCommand = new ListObjectsV2Command({ Bucket: ORIGINAL_BUCKET });
    const data = await s3.send(listCommand);
    const objects = data.Contents || [];

    console.log(`Total objetos encontrados en ${ORIGINAL_BUCKET}: ${objects.length}`);

    for (const obj of objects) {
      const key = obj.Key;
      const localPath = path.join(__dirname, 'tmp_' + path.basename(key));

      // Descargar
      const getCommand = new GetObjectCommand({ Bucket: ORIGINAL_BUCKET, Key: key });
      const response = await s3.send(getCommand);
      await pipelineAsync(response.Body, fs.createWriteStream(localPath));

      // Subir
      const fileStream = fs.createReadStream(localPath);
      const putCommand = new PutObjectCommand({
        Bucket: BACKUP_BUCKET,
        Key: key,
        Body: fileStream
      });
      await s3.send(putCommand);

      // Borrar temporal
      fs.unlinkSync(localPath);
      console.log(`Copiado: ${key}`);
    }

    console.log('✅ Backup y restauración completada.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

backupAndRestore();
