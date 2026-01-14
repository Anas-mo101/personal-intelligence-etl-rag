import { Worker, Job, QueueEvents } from 'bullmq';
import redisLoader from '../loaders/redis';
import LoggerFactory from "../utils/logger/factory";
import { ExtractorManager } from '../services/Extractors/ExtractorManager';
import { IExtractorManagerJob } from '../types';
import UpdateExtractionChannelService from '../services/ExtractionChannelServices/UpdateExtractionChannelService';
import { enqueueInjest } from '../queue/IngestQueue';

export const initExtractor = () => {
  const logger = LoggerFactory.getLogger();

  const worker = new Worker(
    'extract-queue',
    async (job: Job<IExtractorManagerJob>) => {
      const manager = new ExtractorManager();

      const { type, ...data } = job.data;

      const extracted = await manager.process(type, job.data);

      await UpdateExtractionChannelService({
        id: data.channelId,
        data: { lastSyncedAt: new Date() }
      });

      for (let i = 0; i < extracted.count; i++) {
        const chunk = extracted.chunks[i];
        await enqueueInjest({
          channelId: data.channelId,
          personId: data.personId,
          chunk
        });
      }
    },
    {
      connection: redisLoader.getRedis(),
    }
  );

  const injestEvents = new QueueEvents('extract-queue', {
    connection: redisLoader.getRedis()
  });

  worker.on('ready', () => {
    logger.info(`✅ Extract Worker Ready`);
  });

  injestEvents.on('completed', ({ jobId }) => {
    logger.info(`✅ extract ${jobId} completed`);
  });

  injestEvents.on('failed', ({ jobId, failedReason }) => {
    logger.info(`❌ extract ${jobId} failed: ${failedReason}`);
  });
}