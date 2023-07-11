import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { File } from "formidable";
import fs from "fs";

const getUrlFromBucket = (
  bucketName: string,
  region: string,
  fileName: string
) => {
  return encodeURI(
    `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`
  );
};

const initAWSBucket = () => {
  const accessKeyId = process.env.CONFIG_AWS_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CONFIG_AWS_S3_SECRET_ACCESS_KEY;
  const bucketName = process.env.CONFIG_AWS_S3_BUCKET_NAME;
  const bucketRegion = process.env.CONFIG_AWS_S3_BUCKET_REGION;

  if (!accessKeyId || !secretAccessKey || !bucketName || !bucketRegion) {
    throw new Error("AWS config env variables not provided.");
  }
  const client = new S3Client({
    region: bucketRegion,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return { client, bucketName, bucketRegion };
};

const { client: s3Client, bucketName, bucketRegion } = initAWSBucket();

export const uploadFile = async (file: File) => {
  const filePath = file.filepath;
  const fileBlob = fs.readFileSync(filePath);
  const fileName = file.originalFilename || file.newFilename;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBlob,
  });

  await s3Client.send(command);
  const url = getUrlFromBucket(bucketName, bucketRegion, fileName);

  return { url, key: fileName };
};

export const deleteFile = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return s3Client.send(command);
};
