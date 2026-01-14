import { Application } from 'express';
import expressLoader from './express';
import dotenv from 'dotenv';
import path from 'path';
import { initRedis } from './redis';

const init = async ({ expressApp }: { expressApp: Application }) => {
    const result = dotenv.config({
        path: path.resolve(__dirname + '/../../.env'),
    });

    if (result.error) {
        throw result.error;
    }

    await initRedis();
    await expressLoader({ app: expressApp });
};

const initWorker = async () => {
    const result = dotenv.config({
        path: path.resolve(__dirname + '/../../.env'),
    });

    if (result.error) {
        throw result.error; 
    }

    await initRedis();
};

export default { init, initWorker };