import { Person } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type ListPersonRequest = {
  pageNumber: number;
} & Partial<Person>;

interface Response {
  persons: Person[];
  count: number;
  hasMore: boolean;
}

const ListPersonsService = async (data: ListPersonRequest): Promise<Response> => {
  let whereCondition: any = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      whereCondition[key] = data[key];
    }
  }

  const take = 20;
  const skip = take * (+(data.pageNumber ?? "1") - 1);

  const persons = await prisma.person.findMany({
    where: whereCondition,
    take,
    skip,
    orderBy: {
      createdAt: "desc"
    }
  }).catch((err: any) => {
    throw new AppError(400, "PERSON_List_ERROR");
  });

  const count = await prisma.person.count({
    where: whereCondition
  }).catch((err: any) => {
    throw new AppError(400, "PERSON_Count_ERROR");
  });

  const hasMore = count > skip + persons.length;

  return {
    persons,
    count,
    hasMore
  };
}

export default ListPersonsService;
