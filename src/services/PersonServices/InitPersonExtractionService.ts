import { enqueueExtract } from "../../queue/ExtractorQueue";
import ShowPersonService from "./ShowPersonService"

const InitPersonExtractionService = async (id: string) => {
    const person = await ShowPersonService(id);

    const channels = person.channels;
    for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];

        if (!channel.isActive) {
            continue;
        }

        await enqueueExtract({
            channelId: channel.id,
            type: channel.sourceType,
            personId: person.id,
            isBlob: channel.isBlob,
            value: channel.value
        });
    }
}

export default InitPersonExtractionService;