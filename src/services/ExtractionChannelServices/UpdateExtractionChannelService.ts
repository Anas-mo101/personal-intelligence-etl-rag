import AppError from "../../error/AppError";
import prisma from "../../database";
import { ExtractionChannel } from "@prisma/client";

interface Request {
  data: Partial<ExtractionChannel>;
  id: string;
}

const UpdateExtractionChannelService = async ({
  data,
  id
}: Request): Promise<ExtractionChannel> => {
  const toUpdate: any = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      toUpdate[key] = data[key];
    }
  }

  if (Object.keys(toUpdate).length === 0) {
    throw new AppError(400, "ERR_EXTRACTIONCHANNEL_DATA_TO_UPDATE");
  }

  const extractionchannel = await prisma.extractionChannel.update({
    where: { id },
    data: toUpdate
  }).catch((err: any) => {
    throw new AppError(400, "EXTRACTIONCHANNEL_Update_ERROR");
  });

  return extractionchannel;
};

export default UpdateExtractionChannelService;
