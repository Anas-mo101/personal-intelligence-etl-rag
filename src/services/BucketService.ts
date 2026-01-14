import * as Minio from 'minio';
import LoggerFactory from "../utils/logger/factory";

const logger = LoggerFactory.getLogger();

// 1. Pure configuration / Client Factory
export const createBucketClient = (): Minio.Client => {
    return new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT!,
        port: Number(process.env.MINIO_PORT!),
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
    });
};

// 2. Composable logic
// We pass the client and bucket name as arguments (Dependency Injection)
export const ensureBucketExists = async (
    client: Minio.Client, 
    bucketName: string = process.env.MINIO_BUCKET_NAME!
): Promise<void> => {
    try {
        const exists = await client.bucketExists(bucketName);
        if (!exists) {
            await client.makeBucket(bucketName);
        }
    } catch (error) {
        logger.error("BUCKET_SERVICE_CREATE_ERROR");
    }
};