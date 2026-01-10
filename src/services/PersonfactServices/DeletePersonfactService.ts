import AppError from "../../error/AppError";
import prisma from "../../database";

const DeletePersonfactService = async (id: string): Promise<void> => {
  const personfact = await prisma.personFact.delete({
    where: { id }
  }).catch((err: any) => {
    throw new AppError(400, "ERR_NO_PERSONFACT_FOUND");
  });

  if (!personfact) {
    throw new AppError(400, "ERR_NO_PERSONFACT_FOUND");
  }
};

export default DeletePersonfactService;
