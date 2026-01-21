import type { FeatureExtractionPipeline } from "@huggingface/transformers" with { "resolution-mode": "import" };


class EmbeddingPipeline {
    static model = 'Xenova/all-MiniLM-L6-v2'; /// 384 dimensions
    static instance: FeatureExtractionPipeline | null = null; 

    static async getInstance(): Promise<FeatureExtractionPipeline> {
        if (this.instance === null) {
            const { pipeline } = await import("@huggingface/transformers")

            this.instance = await pipeline('feature-extraction', this.model);
        }
        return this.instance;
    }
}

export const GenerateEmbeddingsService = async (text: string): Promise<number[]> => {
    try {
        const extractor = await EmbeddingPipeline.getInstance();
    
        const output = await extractor(text, { 
            pooling: 'mean', 
            normalize: true 
        });
    
        return Array.from(output.data);
    } catch (error) {
        throw new Error(`Embedding failed: ${error}`);
    }
};