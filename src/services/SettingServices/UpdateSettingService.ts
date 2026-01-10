import AppError from "../../error/AppError";
import prisma from "../../database";
import { Setting } from "@prisma/client";

interface Request {
  data: Partial<Setting>;
  id: number;
}

const UpdateSettingService = async ({
  data,
  id
}: Request): Promise<Setting> => {
  const toUpdate: any = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      toUpdate[key] = data[key];
    }
  }

  if (Object.keys(toUpdate).length === 0) {
    throw new AppError(400, "ERR_SETTING_DATA_TO_UPDATE");
  }

  const setting = await prisma.setting.update({
    where: { id },
    data: toUpdate
  }).catch((err: any) => {
    throw new AppError(400, "SETTING_Update_ERROR");
  });

  return setting;
};

export default UpdateSettingService;
