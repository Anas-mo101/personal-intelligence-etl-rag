import AppError from "../../error/AppError";
import prisma from "../../database";
import { Setting } from "@prisma/client";

const ShowSettingService = async (id: number): Promise<Setting> => {
  const setting = await prisma.setting.findUnique({
    where: {
      id
    }
  });

  if (!setting) {
    throw new AppError(404, "ERR_NO_SETTING_FOUND");
  }

  return setting;
};

export default ShowSettingService;
