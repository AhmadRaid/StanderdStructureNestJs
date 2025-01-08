import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

/**
 * Function to generate a dynamic multer upload configuration based on the folder type.
 * @param {string} folderName - The name of the folder where files will be saved (e.g., 'categories', 'packages', 'users').
 * @returns {multer.Options} - A multer configuration object.
 */
export const generateUploadConfig = (folderName: string) => {
  return {
    storage: diskStorage({
      destination: `./uploads/${folderName}`,
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${folderName}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      // Updated to properly handle image file types including SVG
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
          new BadRequestException('Only image files are allowed!'),
          false,
        );
      }

      // Validate file size (e.g., max 2MB)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        return callback(
          new BadRequestException(
            `File too large. Maximum size allowed is 2MB.`,
          ),
          false,
        );
      }

      callback(null, true);
    },
  };
};
