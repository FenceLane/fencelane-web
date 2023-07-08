import { File } from "formidable";
import fs from "fs";

const initAWSBucket = () => {
  const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("AWS config env variables not provided.");
  }
  const client = new S3Client({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return { client, bucketName };
};

const { client: s3Client, bucketName } = initAWSBucket();

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const uploadFile = async (file: File) => {
  const filePath = file.filepath;
  const fileBlob = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: file.originalFilename || file.newFilename,
    Body: fileBlob,
  });

  return s3Client.send(command);
};

export const deleteFile = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return s3Client.send(command);
};
