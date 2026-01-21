import prisma from "../../database";
import { Setting } from "@prisma/client";
import StoreSettingService from "./StoreSettingService";

const FindOrCreateSettingService = async (key: string, defaultValue: string = ""): Promise<Setting> => {
  const setting = await prisma.setting.findUnique({
    where: {
      key
    }
  });

  if (!setting) {
    return await StoreSettingService({
      key,
      value: defaultValue
    })
  }

  return setting;
};

export default FindOrCreateSettingService;
