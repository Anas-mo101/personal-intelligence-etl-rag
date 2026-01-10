import AppError from "../../error/AppError";
import prisma from "../../database";
import { PersonFact } from "@prisma/client";

interface Request {
  data: Partial<PersonFact>;
  id: string;
}

const UpdatePersonfactService = async ({
  data,
  id
}: Request): Promise<PersonFact> => {
  const toUpdate: any = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      toUpdate[key] = data[key];
    }
  }

  if (Object.keys(toUpdate).length === 0) {
    throw new AppError(400, "ERR_PERSONFACT_DATA_TO_UPDATE");
  }

  const personfact = await prisma.personFact.update({
    where: { id },
    data: toUpdate
  }).catch((err: any) => {
    throw new AppError(400, "PERSONFACT_Update_ERROR");
  });

  return personfact;
};

export default UpdatePersonfactService;
