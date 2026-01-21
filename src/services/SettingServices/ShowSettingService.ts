import AppError from "../../error/AppError";
import prisma from "../../database";
import { Setting } from "@prisma/client";

const ShowSettingService = async (key: string): Promise<Setting> => {
  const setting = await prisma.setting.findUnique({
    where: {
      key
    }
  });

  if (!setting) {
    throw new AppError(404, "ERR_NO_SETTING_FOUND");
  }

  return setting;
};

export default ShowSettingService;
