import { Queue } from 'bullmq';
import redisLoader from '../loaders/redis';
import { IIngestionJob } from '../types';

export const injestQueue = new Queue('injest-queue', {
  connection: redisLoader.getRedis()
});

export async function enqueueInjest(data: IIngestionJob) {
  await injestQueue.add(
    'injest',
    data,
    {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000
      }, 
      removeOnComplete: 10, 
      removeOnFail: 10,     
      jobId: `injest:${data.personId}:${Date.now()}`, 
    }
  );
}