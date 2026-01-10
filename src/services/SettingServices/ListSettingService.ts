import { Setting } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type ListSettingRequest = {
  pageNumber?: string;
} & Partial<Setting>;

interface Response {
  settings: Setting[];
  count: number;
  hasMore: boolean;
}

const ListSettingsService = async (data: ListSettingRequest): Promise<Response> => {
  let whereCondition: any = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      whereCondition[key] = data[key];
    }
  }

  const take = 20;
  const skip = take * (+(data.pageNumber ?? "1") - 1);

  const settings = await prisma.setting.findMany({
    where: whereCondition,
    take,
    skip,
    orderBy: {
      createdAt: "desc"
    }
  }).catch((err: any) => {
    throw new AppError(400, "SETTING_List_ERROR");
  });

  const count = await prisma.setting.count({
    where: whereCondition
  }).catch((err: any) => {
    throw new AppError(400, "SETTING_Count_ERROR");
  });

  const hasMore = count > skip + settings.length;

  return {
    settings,
    count,
    hasMore
  };
}

export default ListSettingsService;
