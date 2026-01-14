import IORedis from 'ioredis';

let redis: IORedis | null = null;

/**
 * Initializes the Redis instance.
 */
export const initRedis = () => {
    if (redis == null) {
        redis = new IORedis(
            process.env.REDIS_URI!,
            { 
                maxRetriesPerRequest: null, 
                enableReadyCheck: false 
            }
        );
    }
    
    return redis;
};

/**
 * Helper to get the existing redis instance. 
 * Throws an error if accessed before init().
 */
export const getRedis = (): IORedis => {
    if (!redis) {
        return initRedis();
    }
    return redis;
};

export default { initRedis, getRedis };