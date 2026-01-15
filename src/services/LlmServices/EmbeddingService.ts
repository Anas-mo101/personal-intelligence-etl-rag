
class EmbeddingPipeline {
    static model = 'Xenova/all-MiniLM-L6-v2'; /// 384 dimensions
    static instance: any = null;

    static async getInstance() {
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
    
        // Generate the embedding (raw tensor)
        const output = await extractor(text, { 
            pooling: 'mean', 
            normalize: true 
        });
    
        // Convert the tensor to a standard JavaScript array
        return Array.from(output.data);
    } catch (error) {
        throw new Error(`Embedding failed: ${error}`);
    }
};