import AppError from "../../error/AppError";
import prisma from "../../database";
import { Person } from "@prisma/client";

const ShowPersonService = async (id: string): Promise<Person> => {
  const person = await prisma.person.findUnique({
    where: {
      id
    }
  });

  if (!person) {
    throw new AppError(404, "ERR_NO_PERSON_FOUND");
  }

  return person;
};

export default ShowPersonService;
