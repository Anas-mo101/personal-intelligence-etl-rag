import AppError from "../../error/AppError";
import prisma from "../../database";
import { PersonFact } from "@prisma/client";

const ShowPersonfactService = async (id: string): Promise<PersonFact> => {
  const personfact = await prisma.personFact.findUnique({
    where: {
      id
    }
  });

  if (!personfact) {
    throw new AppError(404, "ERR_NO_PERSONFACT_FOUND");
  }

  return personfact;
};

export default ShowPersonfactService;
