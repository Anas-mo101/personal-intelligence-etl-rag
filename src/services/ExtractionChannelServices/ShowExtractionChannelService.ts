import AppError from "../../error/AppError";
import prisma from "../../database";
import { ExtractionChannel } from "@prisma/client";

const ShowExtractionChannelService = async (id: string): Promise<ExtractionChannel> => {
  const extractionchannel = await prisma.extractionChannel.findUnique({
    where: {
      id
    }
  });

  if (!extractionchannel) {
    throw new AppError(404, "ERR_NO_EXTRACTIONCHANNEL_FOUND");
  }

  return extractionchannel;
};

export default ShowExtractionChannelService;
