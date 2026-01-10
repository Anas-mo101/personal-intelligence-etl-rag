import AppError from "../../error/AppError";
import prisma from "../../database";

const DeleteSettingService = async (id: number): Promise<void> => {
  const setting = await prisma.setting.delete({
    where: { id }
  }).catch((err: any) => {
    throw new AppError(400, "ERR_NO_SETTING_FOUND");
  });

  if (!setting) {
    throw new AppError(400, "ERR_NO_SETTING_FOUND");
  }
};

export default DeleteSettingService;
