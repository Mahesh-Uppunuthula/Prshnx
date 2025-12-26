import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_BUCKET_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_BUCKET_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_BUCKET_SECRET_ACCESS_KEY!,
  },
});

export class R2Service {
  async upload(file: File | Blob, key: string) {
    const fileBuffer = await file.arrayBuffer();
    await s3Client.send(
      new PutObjectCommand({
        Key: key,
        Bucket: process.env.R2_BUCKET_NAME!,
        Body: Buffer.from(fileBuffer),
        ContentType:
          file instanceof File ? file.type : "application/octet-stream",
      })
    );
    //  TODO - change this - it work only in dev mode
    return `${process.env.R2_BUCKET_DEV_ENDPOINT!}/${key}`;
  }
  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });
    const response = await s3Client.send(command);
    return response;
  }
}
