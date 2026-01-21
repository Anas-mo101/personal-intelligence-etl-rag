import { Setting } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type StoreSetting = {
	key: string;
	value: string;
};

const StoreSettingService = async (data: StoreSetting): Promise<Setting> => {
  const setting = await prisma.setting.create({
    data: data
  }).catch((err: any) => {
    console.log(err)
    throw new AppError(400, "SETTING_Store_ERROR");
  });

  return setting;
}

export default StoreSettingService;
