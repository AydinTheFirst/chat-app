import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { S3Service } from '~/common/modules/aws/s3.service';

@Controller('files')
export class FilesController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.s3Service.uploadFiles(files);
  }
}
