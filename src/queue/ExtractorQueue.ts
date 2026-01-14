import { Queue } from 'bullmq';
import redisLoader from '../loaders/redis';
import { IExtractorManagerJob } from '../types';

export const extractQueue = new Queue('extract-queue', {
  connection: redisLoader.getRedis()
});

export async function enqueueExtract(data: IExtractorManagerJob) {
  await extractQueue.add(
    'extract',
    data,
    {
      attempts: 5, // retries
      backoff: {
        type: 'exponential',
        delay: 1000
      },
      removeOnComplete: 10, // keep last 1000 complete jobs
      removeOnFail: 10,     // keep last 1000 failed jobs
      jobId: `injest:${data.personId}:${data.channelId}`, // idempotency key (optional)
    }
  );
}