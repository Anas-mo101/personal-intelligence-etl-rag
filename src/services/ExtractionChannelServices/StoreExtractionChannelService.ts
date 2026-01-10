import { ExtractionChannel, SourceType } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type StoreExtractionChannel = {
  id: string;
	personId: string;
	sourceType: SourceType;
	lastSyncedAt?: Date;
	isActive: boolean;
};

const StoreExtractionChannelService = async (data: StoreExtractionChannel): Promise<ExtractionChannel> => {
  const extractionchannel = await prisma.extractionChannel.create({
    data: data
  }).catch((err: any) => {
    throw new AppError(400, "EXTRACTIONCHANNEL_Store_ERROR");
  });

  return extractionchannel;
}

export default StoreExtractionChannelService;
