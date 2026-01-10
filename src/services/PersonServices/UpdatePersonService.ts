import AppError from "../../error/AppError";
import prisma from "../../database";
import { Person } from "@prisma/client";

interface Request {
  data: Partial<Person>;
  id: string;
}

const UpdatePersonService = async ({
  data,
  id
}: Request): Promise<Person> => {
  const toUpdate: any = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      toUpdate[key] = data[key];
    }
  }

  if (Object.keys(toUpdate).length === 0) {
    throw new AppError(400, "ERR_PERSON_DATA_TO_UPDATE");
  }

  const person = await prisma.person.update({
    where: { id },
    data: toUpdate
  }).catch((err: any) => {
    throw new AppError(400, "PERSON_Update_ERROR",);
  });

  return person;
};

export default UpdatePersonService;
