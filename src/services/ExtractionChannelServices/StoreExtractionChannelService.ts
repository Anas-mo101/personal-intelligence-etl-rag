import { ExtractionChannel, SourceType } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";
import { enqueueExtract } from "../../queue/ExtractorQueue";

export type StoreExtractionChannel = {
  personId: string;
  sourceType: SourceType;
  lastSyncedAt?: Date;
  isActive: boolean;
  value: string;
  isBlob: boolean
};

const StoreExtractionChannelService = async (data: StoreExtractionChannel): Promise<ExtractionChannel> => {
  const channel = await prisma.extractionChannel.create({
    data: data
  }).catch((err: any) => {
    throw new AppError(400, "EXTRACTIONCHANNEL_Store_ERROR");
  });

  await enqueueExtract({
    channelId: channel.id,
    type: channel.sourceType,
    personId: channel.personId,
    isBlob: channel.isBlob,
    value: channel.value
  });

  return channel;
}

export default StoreExtractionChannelService;
