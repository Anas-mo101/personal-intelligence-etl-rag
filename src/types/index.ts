import { Prisma, SourceType } from "@prisma/client";

export type ISourceType = SourceType;

export const SOURCE_TYPES = [
    "TXT", "PDF", "FACEBOOK", "INSTAGRAM", "X",
    "WEB_SCRAPER", "IMAGE", "YOUTUBE", "VIDEO", "AUDIO"
] as const;

export interface IExtractorManagerJob {
    personId: string
    channelId: string
    type: ISourceType
    isBlob: boolean
    value: string
}

export interface IIngestionJob { 
    personId: string
    channelId: string
    chunk: string
}

export type PersonWithInfo = Prisma.PersonGetPayload<{
    include: {
        channels: true,
        facts: true
    }
}>