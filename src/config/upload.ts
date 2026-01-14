import path from "path";
import { FileFilterCallback } from "multer";
import { MinioStorageEngine } from "@namatery/multer-minio";
import { createBucketClient } from "../services/BucketService";
import { Express } from "express";

const publicFolder = path.resolve(__dirname, "..", "..", "public");
const allowed: string[] = [];

export default {
  directory: publicFolder,
  storage: new MinioStorageEngine(
    createBucketClient(),
    "pi",
    {
      bucket: {
        init: false,
        versioning: false,
        forceDelete: true
      },
      object: {
        name: (req: Express.Request, file: Express.Multer.File) => {
          return `${Date.now()}-${file.originalname}`
        },
        useOriginalFilename: false,
      },
    }
  ),
  fileFilter: (req: any, file: Express.Multer.File, callback: FileFilterCallback) => {
    const ext = path.extname(file.originalname);

    if (allowed.includes(ext) === false) {
      return callback(new Error('ERR_NOT_ALLOWED_TYPE'))
    }

    callback(null, true);
  },
  limits: {
    fileSize: 100 * (1024 * 1024)
  }
};
