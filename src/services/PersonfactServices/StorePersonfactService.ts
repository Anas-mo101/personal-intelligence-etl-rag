import { PersonFact } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type StorePersonfact = {
	name: string;
	key: string;
	value: string;
	isVerified: boolean;
	personId: string;
};

const StorePersonfactService = async (data: StorePersonfact): Promise<PersonFact> => {
  const personfact = await prisma.personFact.create({
    data: data
  }).catch((err: any) => {
    throw new AppError(400, "PERSONFACT_Store_ERROR");
  });

  return personfact;
}

export default StorePersonfactService;
