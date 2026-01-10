import { Application } from 'express';
import expressLoader from './express';
import dotenv from 'dotenv';
import path from 'path';

const init = async ({ expressApp }: { expressApp: Application }) => {
    const result = dotenv.config({
        path: path.resolve(__dirname + '/../../.env'),
    });

    if (result.error) {
        throw result.error;
    }

    await expressLoader({ app: expressApp });
};

export default { init };