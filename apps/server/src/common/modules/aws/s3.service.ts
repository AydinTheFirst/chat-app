import { S3 } from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class S3Service implements OnModuleInit {
  readonly bucketName = process.env.AWS_BUCKET_NAME;

  s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.AWS_ENDPOINT,
    maxAttempts: 3,
    region: 'auto',
  });

  private readonly logger = new Logger(S3Service.name);

  async deleteFile(Key: string) {
    const result = await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key,
    });

    return result;
  }

  async getFile(Key: string) {
    try {
      const result = await this.s3.getObject({
        Bucket: this.bucketName,
        Key,
      });

      return result;
    } catch (err) {
      this.logger.error(`Error getting file ${Key} from S3`, err);
      return null;
    }
  }

  async getFiles() {
    const result = await this.s3.listObjects({
      Bucket: this.bucketName,
    });

    return result.Contents;
  }

  async onModuleInit() {
    try {
      await this.s3.headBucket({
        Bucket: this.bucketName,
      });
      this.logger.debug(`S3 bucket ${this.bucketName} is ready`);
    } catch (err) {
      this.logger.error(`S3 bucket ${this.bucketName} is not accessible`, err);
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const key = crypto.randomUUID();

    await this.s3.putObject({
      Body: file.buffer,
      Bucket: this.bucketName,
      ContentType: file.mimetype,
      Key: key,
    });

    return key;
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const keys = await Promise.all(
      files.map(async (file) => {
        return await this.uploadFile(file);
      }),
    );

    return keys;
  }
}
