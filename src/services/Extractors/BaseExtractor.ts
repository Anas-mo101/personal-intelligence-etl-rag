import { IExtractorManagerJob, ISourceType } from "../../types";


export interface IExtractor {
    // Can this adapter handle this specific file type or source?
    canHandle(sourceType: ISourceType): boolean;

    // The logic to turn raw data into a clean string + metadata
    extract(rawData: IExtractorManagerJob): Promise<{
        chunks: string[];
        count: number
    }>;
}

export class BaseExtractor {
    chunk(input: string, size: number = 500, overlap: number = 50): string[] {
        if (size <= overlap) {
            throw new Error("Chunk size must be greater than overlap.");
        }

        const chunks: string[] = [];
        let curIdx = 0;

        while (curIdx < input.length) {
            let endIdx = curIdx + size;

            if (endIdx < input.length) {
                const lastSpace = input.lastIndexOf(' ', endIdx);
                if (lastSpace > curIdx) {
                    endIdx = lastSpace;
                }
            }

            chunks.push(input.substring(curIdx, endIdx).trim());
            
            // Move forward by size minus the overlap to keep context
            curIdx = endIdx - overlap;
            
            // Safety check to prevent infinite loops if overlap is messy
            if (curIdx >= input.length || endIdx >= input.length) break;
        }

        return chunks.filter(c => c.length > 0);
    }
}