import { ChatCompletionMessageParam } from "openai/resources/index.js";
import { oai } from "./BaseLlmService";
import ToolRegistry from "./ToolRegistry";
import FindOrCreateSettingService from "../SettingServices/FindOrCreateSettingService";

export const McpOrchestratorService = async (userPrompt: string) => {

    const systemPrompt = await FindOrCreateSettingService("sys-prompt");

    let messages: ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt.value },
        { role: "user", content: userPrompt }
    ];

    let isDone = false;

    while (!isDone) {
        const response = await oai.chat.completions.create({
            model: "llama3.1",
            messages,
            tools: ToolRegistry.getManifest(),
            tool_choice: "auto",
        });

        const message = response.choices[0].message;
        messages.push(message);

        if (message.tool_calls) {
            for (const toolCall of message.tool_calls) {
                if (toolCall.type === "function") {

                    const tool = ToolRegistry.getTool(toolCall.function.name);

                    if (tool) {
                        const rawArgs = JSON.parse(toolCall.function.arguments);

                        console.log(rawArgs);

                        const validatedArgs = tool.schema.parse(rawArgs);
                        const result = await tool.callback(validatedArgs);
                        const validatedResults = tool.outputSchema.parse( result );

                        console.log(validatedResults);

                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: JSON.stringify(validatedResults)
                        });
                    }
                }
            }
        } else {
            isDone = true;
        }
    }

    console.dir(messages, { depth: null })

    return messages[messages.length - 1].content;
}