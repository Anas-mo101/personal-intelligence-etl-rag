import { z } from "zod";
import { IngestionSchema } from "../../schema/IngestionSchema";
import { instructorClient } from "./BaseLlmService";

type IIngestion = z.infer<typeof IngestionSchema>;

export const InjestorService = async (chunk: string): Promise<IIngestion> => {
    try {
        return await instructorClient.chat.completions.create({
            messages: [
                { role: "user", content: chunk }
            ],
            model: "llama3.1",
            response_model: {
                schema: IngestionSchema,
                name: "GraphExtraction"
            },
            max_retries: 3,
        });

    } catch (error) {
        throw new Error(`Injestor failed: ${error}`);
    }
}