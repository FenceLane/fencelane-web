import AWS from "aws-sdk";
import { File } from "formidable";
import fs from "fs";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

export const uploadFile = async (file: File) => {
  const filePath = file.filepath;
  const fileBlob = fs.readFileSync(filePath);

  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw Error("AWS_S3_BUCKET_NAME env variable was not provided.");
  }

  const uploadedImage = await s3
    .upload({
      Bucket: bucketName,
      Key: file.originalFilename || file.newFilename,
      Body: fileBlob,
    })
    .promise();

  return uploadedImage;
};
