import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import { join } from 'path';
import { InternalServerErrorException } from '@nestjs/common';

export const firebaseAdminInit = () => {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.FIREBASE_BUCKET_NAME,
    });
  }
};

export const uploadStorageFile = async (
  filename: string,
  type: string,
  mimeType: string,
  path: string,
): Promise<string> => {
  const bucket = admin.storage().bucket();
  const token = uuidv4();

  const metadata = {
    metadata: {
      firebaseStorageDownloadTokens: token,
      cacheControl: 'public, max-age=31536000',
    },
    contentType: mimeType,
  };

  const options = {
    destination: `${type}/${filename}`,
    predefinedAcl: 'publicRead' as
      | 'projectPrivate'
      | 'bucketOwnerRead'
      | 'bucketOwnerFullControl'
      | 'authenticatedRead',
    gzip: true,
    metadata,
  };

  try {
    // Upload the file to Firebase
    await bucket.upload(path, options);

    // Generate the public URL for the uploaded file
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      `${type}/${filename}`,
    )}?alt=media&token=${token}`;

    console.log('File uploaded successfully:', url);

    // Delete the local file after successful upload
    await fs.unlink(path);
    console.log('Local file deleted:', path);

    return url;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);

    throw new InternalServerErrorException('Error uploading file');
  }
};
