import { z, ZodObject, ZodString } from "zod";
import StorePersonService from "../PersonServices/StorePersonService";

type ZodeType = ZodObject | ZodString;

// 1. Define the internal structure for a single tool
export interface Tool<T extends ZodeType, O extends ZodeType> {
    name: string;
    description: string;
    schema: T;
    outputSchema: O;
    callback: (args: z.infer<T>) => Promise<any>;
}

export class ToolRegistry {
    // We store tools as 'any' internally because each tool has a different schema generic
    private toolings: Map<string, Tool<any, any>> = new Map();

    /**
     * Registers a new tool. The generic T ensures the callback 
     * argument 'args' matches the 'schema' exactly.
     */
    register<T extends ZodeType, O extends ZodeType>(
        name: string,
        description: string,
        schema: T,
        outputSchema: O,
        callback: (args: z.infer<T>) => Promise<any>
    ) {
        this.toolings.set(name, {
            name,
            description,
            schema,
            outputSchema,
            callback
        });
        return this; // For chaining
    }

    /**
     * Converts the registry into the OpenAI/Llama Function calling format
     */
    getManifest() {
        return Array.from(this.toolings.values()).map((t: Tool<ZodeType, ZodeType>) => ({
            type: "function" as const,
            function: {
                name: t.name,
                description: t.description,
                parameters: t.schema.toJSONSchema()
            }
        }))
    }

    getTool(name: string) {
        return this.toolings.get(name);
    }
}

const registry = new ToolRegistry();

registry.register(
    "search_graph",
    "Query the Neo4j knowledge graph",
    z.object({

    }),
    z.object({
        result: z.string(),
    }),
    async (args) => {
        const { } = args;

        return {
            result: "this is the result"
        };
    }
);

registry.register(
    "create_person_with_facts",
    // 💡 HIGH-PRECISION DESCRIPTION
    "Create a new person record in the database by extracting identifying information and characteristics as facts. " +
    "Trigger this tool when the user provides personal details or requests to save a new person profile. " +
    "Convert natural language attributes (like 'his name is Max' or 'age 18') into an array of fact objects. " +
    "Each fact must have a 'name' (the attribute name, sentence Case), 'key' (the attribute key, lowercase) and 'value' (the attribute value as a string).",
    z.object({
        facts: z.array(
            z.object({
                name: z.string().describe("The attribute name, e.g., 'Age', 'Job', 'Place of birth'"),
                key: z.string().describe("The attribute label, e.g., 'first_name', 'mother_name', 'location'"),
                value: z.string().describe("The specific value for that attribute"),
                isVerified: z.boolean().optional().default(true)
            })
        )
    }),
    z.string(),
    async (args) => {
        try {
            // Map the tool arguments to your Service
            const person = await StorePersonService(args);
            return `Successfully created person: ${person.id} with ${args.facts.length} facts.`;
        } catch (error) {
            return `Failed to create person: ${error}`;
        }
    }
);

export default registry;