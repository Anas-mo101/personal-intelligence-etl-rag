import * as stream from 'node:stream';

import { IExtractorManagerJob, ISourceType } from "../../types";
import { createBucketClient } from "../BucketService";
import { BaseExtractor, IExtractor } from "./BaseExtractor";


export class TxtExtractor extends BaseExtractor implements IExtractor {
  canHandle(sourceType: ISourceType): boolean {
    return sourceType === "TXT";
  }

  private async streamToString(readable: stream.Readable): Promise<string> {
    const chunks: any[] = [];
    for await (const chunk of readable) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
  }

  async extract(data: IExtractorManagerJob) {
    const minioClient = createBucketClient();

    if (!process.env.MINIO_BUCKET_NAME) {
      throw new Error("Missing bucket name");
    }

    let content = data.value;

    if (data.isBlob) {
      if (!data.value.toLowerCase().endsWith('.txt')) {
        throw new Error(`Unsupported file type for TxtExtractor: ${data.value}`);
      }

      const fileStream: stream.Readable = await minioClient.getObject(
        process.env.MINIO_BUCKET_NAME,
        data.value
      )

      content = await this.streamToString(fileStream);
    } 

    const output = this.chunk(content);

    const uploadPromises = output.map((chunk, index) => {
      const fileName = `chunks/${data.personId}/txt/chunk-${index}.txt`;
      const buffer = Buffer.from(chunk, 'utf-8');

      if (!process.env.MINIO_BUCKET_NAME) {
        throw new Error("Missing bucket name");
      }

      return minioClient.putObject(
        process.env.MINIO_BUCKET_NAME,
        fileName,
        buffer,
        buffer.length,
        { 'Content-Type': 'text/plain' }
      );
    });

    await Promise.all(uploadPromises);

    return {
      chunks: output,
      count: output.length
    };
  }
}