import gracefulShutdown from "http-graceful-shutdown";
import express, { Application } from "express";
import loader from "./loaders"
import LoggerFactory from "./utils/logger/factory";
import { getHost } from "./utils/host";


(async () => {
    const logger = LoggerFactory.getLogger();

    const app: Application = express();

    await loader.init({ expressApp: app });

    const server = app.listen(process.env.PORT, () => {
        const host = getHost();
        logger.info(`Server started on ${host}:${process.env.PORT}`);
    });

    gracefulShutdown(server);
})();