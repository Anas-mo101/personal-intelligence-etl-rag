import AppError from "../../error/AppError";
import prisma from "../../database";

const DeleteExtractionChannelService = async (id: string): Promise<void> => {
  const extractionchannel = await prisma.extractionChannel.delete({
    where: { id }
  }).catch((err: any) => {
    throw new AppError(400, "ERR_NO_EXTRACTIONCHANNEL_FOUND");
  });

  if (!extractionchannel) {
    throw new AppError(400, "ERR_NO_EXTRACTIONCHANNEL_FOUND");
  }
};

export default DeleteExtractionChannelService;
