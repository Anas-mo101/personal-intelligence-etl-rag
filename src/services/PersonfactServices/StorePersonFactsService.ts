import { PersonFact } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type StorePersonfact = {
	name: string;
	key: string;
	value: string;
	isVerified: boolean;
	personId: string;
}[];

const StorePersonFactsService = async (data: StorePersonfact): Promise<PersonFact[]> => {
  const facts = await prisma.personFact.createManyAndReturn({
    data: data
  }).catch((err: any) => {
    throw new AppError(400, "PERSONFACT_Store_ERROR");
  });

  return facts;
}

export default StorePersonFactsService;
