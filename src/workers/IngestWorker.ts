import { Worker, Job, QueueEvents } from 'bullmq';
import redisLoader from '../loaders/redis';
import LoggerFactory from "../utils/logger/factory";
import { IIngestionJob } from '../types';

export const initInjestor = () => {
    const logger = LoggerFactory.getLogger();

    const worker = new Worker(
        'injest-queue',
        async (job: Job<IIngestionJob>) => {
            const { data } = job;

            /// channels
            /// facts
            /// graph relations
            /// embedings

        },
        {
            connection: redisLoader.getRedis(),
            lockDuration: 60000
        }
    );

    const injestEvents = new QueueEvents('injest-queue', {
        connection: redisLoader.getRedis()
    });

    worker.on('ready', () => {
        logger.info(`✅ Injest Worker Ready`);
    });

    injestEvents.on('completed', ({ jobId }) => {
        logger.info(`✅ email ${jobId} completed`);
    });

    injestEvents.on('failed', ({ jobId, failedReason }) => {
        logger.info(`❌ email ${jobId} failed: ${failedReason}`);
    });
}