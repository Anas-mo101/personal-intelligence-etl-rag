import AppError from "../../error/AppError";
import prisma from "../../database";
import { PersonWithInfo } from "../../types";

const ShowPersonService = async (id: string): Promise<PersonWithInfo> => {
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      facts: true,
      channels: true
    }
  });

  if (!person) {
    throw new AppError(404, "ERR_NO_PERSON_FOUND");
  }

  return person;
};

export default ShowPersonService;
