import AWS from "aws-sdk";
import { File } from "formidable";
import fs from "fs";

const initAWSBucket = () => {
  const client = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  });

  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw Error("AWS_S3_BUCKET_NAME env variable was not provided.");
  }

  return { client, bucketName };
};

const { client: s3, bucketName } = initAWSBucket();

export const uploadFile = async (file: File) => {
  const filePath = file.filepath;
  const fileBlob = fs.readFileSync(filePath);

  const uploadedImage = await s3
    .upload({
      Bucket: bucketName,
      Key: file.originalFilename || file.newFilename,
      Body: fileBlob,
    })
    .promise();

  return uploadedImage;
};

export const deleteFile = async (key: string) => {
  return s3
    .deleteObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
};
