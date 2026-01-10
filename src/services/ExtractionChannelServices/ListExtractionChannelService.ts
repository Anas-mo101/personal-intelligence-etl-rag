import { ExtractionChannel } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type ListExtractionChannelRequest = {
  pageNumber?: string;
} & Partial<ExtractionChannel>;

interface Response {
  extractionchannels: ExtractionChannel[];
  count: number;
  hasMore: boolean;
}

const ListExtractionChannelsService = async (data: ListExtractionChannelRequest): Promise<Response> => {
  let whereCondition: any = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      whereCondition[key] = data[key];
    }
  }

  const take = 20;
  const skip = take * (+(data.pageNumber ?? "1") - 1);

  const extractionchannels = await prisma.extractionChannel.findMany({
    where: whereCondition,
    take,
    skip,
  }).catch((err: any) => {
    throw new AppError(400,  "EXTRACTIONCHANNEL_List_ERROR");
  });

  const count = await prisma.extractionChannel.count({
    where: whereCondition
  }).catch((err: any) => {
    throw new AppError(400, "EXTRACTIONCHANNEL_Count_ERROR");
  });

  const hasMore = count > skip + extractionchannels.length;

  return {
    extractionchannels,
    count,
    hasMore
  };
}

export default ListExtractionChannelsService;
