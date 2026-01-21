import { Person } from "@prisma/client";
import prisma from "../../database";
import AppError from "../../error/AppError";

export type StorePerson = {
  facts: {
    name: string;
    key: string;
    value: string;
    isVerified?: boolean;
  }[]
};

const StorePersonService = async (data: StorePerson): Promise<Person> => {
  const person = await prisma.person.create({
    data: {
      facts: {
        createMany: {
          data: data.facts
        }
      }
    }
  }).catch((err: any) => {
    throw new AppError(400, "PERSON_Store_ERROR");
  });

  return person;
}

export default StorePersonService;
