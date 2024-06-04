import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma.service";

@Injectable()
export class MinioFileService {
  constructor(private readonly prisma: PrismaService) {}

  getFileBySha256 = async (sha256: string) => {
    const minioFile = await this.prisma.minioFile.findUnique({
      where: {
        sha256,
      },
    });
    return minioFile;
  };

  getFileById = async (id: string) => {
    const minioFile = await this.prisma.minioFile.findUnique({
      where: {
        id,
      },
    });
    return minioFile;
  };

  getPartsByUploadId = async (uploadId: string) => {
    const minioFileParts = await this.prisma.minioFilePart.findMany({
      where: {
        uploadId,
      },
    });
    return minioFileParts;
  };

  uploadSmallFile = async (sha256: string, size: string, type: string) => {
    const minioFile = await this.prisma.minioFile.create({
      data: {
        sha256,
        size,
        type,
        finished: true,
      },
    });
    return minioFile;
  };

  uploadLargeFile = async (
    sha256: string,
    size: string,
    type: string,
    uploadId: string,
  ) => {
    const minioFile = await this.prisma.minioFile.create({
      data: {
        sha256,
        size,
        type,
        uploadId,
      },
    });
    return minioFile;
  };

  uploadFilePart = async (
    uploadId: string,
    partNumber: number,
    eTag: string,
  ) => {
    const minioFilePart = await this.prisma.minioFilePart.create({
      data: {
        uploadId,
        partNumber,
        eTag,
      },
    });
    return minioFilePart;
  };

  mergeFileParts = async (sha256: string) => {
    const minioFile = await this.prisma.minioFile.update({
      where: {
        sha256,
      },
      data: {
        finished: true,
      },
    });
    return minioFile;
  };
}
