import { PersonFact } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type ListPersonFactRequest = {
  pageNumber?: string;
} & Partial<PersonFact>;

interface Response {
  personfacts: PersonFact[];
  count: number;
  hasMore: boolean;
}

const ListPersonFactsService = async (data: ListPersonFactRequest): Promise<Response> => {
  let whereCondition: any = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      whereCondition[key] = data[key];
    }
  }

  const take = 20;
  const skip = take * (+(data.pageNumber ?? "1") - 1);

  const personfacts = await prisma.personFact.findMany({
    where: whereCondition,
    take,
    skip,
    orderBy: {
      createdAt: "desc"
    }
  }).catch((err: any) => {
    throw new AppError(400, "PERSONFACT_List_ERROR");
  });

  const count = await prisma.personFact.count({
    where: whereCondition
  }).catch((err: any) => {
    throw new AppError(400, "PERSONFACT_Count_ERROR");
  });

  const hasMore = count > skip + personfacts.length;

  return {
    personfacts,
    count,
    hasMore
  };
}

export default ListPersonFactsService;
