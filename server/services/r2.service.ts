import {
  DeleteObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
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
      }),
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
  async listTopLevelFolders(prefix: string, delimiter?: string) {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      Prefix: prefix,
      Delimiter: delimiter,
    });
    const response = await s3Client.send(command);

    const folders = (response.CommonPrefixes || []).map((item) => ({
      key: item.Prefix,
      name: item.Prefix?.slice(prefix.length, -1).split("/")[0],
      type: "folder",
    }));

    console.log("folders", folders);

    return folders;
  }

  async listAssets(prefix: string) {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      Prefix: prefix,
    });
    const response = await s3Client.send(command);

    console.log("response", response);

    console.log(process.env.R2_BUCKET_DEV_ENDPOINT!);
    const assets = [];
    for (const item of response.Contents || []) {
      if (item.Size === 0 && item.Key?.endsWith("/")) continue;
      assets.push({
        key: item.Key,
        name: item.Key?.slice(prefix.length).split("/")[0],
        url: `${process.env.R2_BUCKET_DEV_ENDPOINT!}/${item.Key}`,
        size: item.Size,
        lastModified: item.LastModified,
        type: "file",
      });
    }

    console.log("assets", assets);

    return assets;
  }
}
