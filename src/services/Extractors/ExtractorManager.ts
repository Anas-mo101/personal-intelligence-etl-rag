import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { IExtractorManagerJob, ISourceType } from "../../types";
import { IExtractor } from "./BaseExtractor";
import { TxtExtractor } from "./TxtExtractor";

export class ExtractorManager {
    private extractors: IExtractor[] = [
        new TxtExtractor(),
    ];

    async process(sourceType: ISourceType, data: IExtractorManagerJob) {
        const adapter = this.extractors.find(e => e.canHandle(sourceType));

        if (!adapter){
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "NO_ADAPTER_FOUND",
                `No adapter found for ${sourceType}`
            )
        }

        return await adapter.extract(data);
    }
}