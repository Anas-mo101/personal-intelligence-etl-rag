import { Person } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type StorePerson = {};

const StorePersonService = async (data: StorePerson): Promise<Person> => {
  const person = await prisma.person.create({
    data: data
  }).catch((err: any) => {
    throw new AppError(400, "PERSON_Store_ERROR");
  });

  return person;
}

export default StorePersonService;
