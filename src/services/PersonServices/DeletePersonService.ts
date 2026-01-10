import AppError from "../../error/AppError";
import prisma from "../../database";

const DeletePersonService = async (id: string): Promise<void> => {
  const person = await prisma.person.delete({
    where: { id }
  }).catch((err: any) => {
    throw new AppError(400, "ERR_NO_PERSON_FOUND");
  });

  if (!person) {
    throw new AppError(400, "ERR_NO_PERSON_FOUND");
  }
};

export default DeletePersonService;
