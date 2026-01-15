import { ExtractionChannel, SourceType } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";
import { enqueueExtract } from "../../queue/ExtractorQueue";

export type StoreExtractionChannel = {
  personId: string;
  sourceType: SourceType;
  lastSyncedAt?: Date;
  isActive?: boolean;
  value: string;
  isBlob: boolean
}[];

const StoreExtractionChannelsService = async (data: StoreExtractionChannel): Promise<void> => {
  const extractionchannel = await prisma.extractionChannel.createManyAndReturn({
    data: data
  }).catch((err: any) => {
    throw new AppError(400, "EXTRACTIONCHANNEL_Store_ERROR");
  });

  for (let i = 0; i < extractionchannel.length; i++) {
    const channel = extractionchannel[i];

    if (!channel.isActive) {
      continue;
    }

    await enqueueExtract({
      channelId: channel.id,
      type: channel.sourceType,
      personId: channel.personId,
      isBlob: channel.isBlob,
      value: channel.value
    });
  }

  return;
}

export default StoreExtractionChannelsService;
