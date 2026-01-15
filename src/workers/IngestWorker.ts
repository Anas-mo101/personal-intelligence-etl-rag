import { Worker, Job, QueueEvents } from 'bullmq';
import redisLoader from '../loaders/redis';
import LoggerFactory from "../utils/logger/factory";
import { IIngestionJob } from '../types';
import { InjestorService } from '../services/LlmServices/InjestorService';
import StorePersonFactsService from '../services/PersonfactServices/StorePersonFactsService';
import StoreExtractionChannelsService, { StoreExtractionChannel } from '../services/ExtractionChannelServices/StoreExtractionChannelsService';
import { StoreToGraphService } from '../services/GraphServices/StoreToGraphService';
import { GenerateEmbeddingsService } from '../services/LlmServices/EmbeddingService';

export const initInjestor = () => {
    const logger = LoggerFactory.getLogger();

    const worker = new Worker(
        'injest-queue',
        async (job: Job<IIngestionJob>) => {
            const { data } = job;

            const injested = await InjestorService(data.chunk);

            const channels = injested.channels.map((c) => {
                return {
                    ...c,
                    personId: data.personId,
                }
            });

            const facts = injested.facts.map((f) => {
                return {
                    ...f,
                    key: f.name.toLowerCase().replace("", "-"),
                    isVerified: false,
                    personId: data.personId,
                }
            });

            /// gen embedings for chunk to save in vector
            const embedding = await GenerateEmbeddingsService(data.chunk);

            await Promise.all([
                StorePersonFactsService(facts),
                StoreExtractionChannelsService(channels),
                StoreToGraphService(injested.entities, injested.relationships, embedding, data.chunk)
            ])
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