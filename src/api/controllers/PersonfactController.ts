import { Request, Response } from "express";
import DeletePersonfactService from "../../services/PersonfactServices/DeletePersonfactService";
import ListPersonfactService from "../../services/PersonfactServices/ListPersonfactService";
import ShowPersonfactService from "../../services/PersonfactServices/ShowPersonfactService";
import StorePersonfactService from "../../services/PersonfactServices/StorePersonfactService";
import UpdatePersonfactService from "../../services/PersonfactServices/UpdatePersonfactService";

type IndexQuery = {
  pageNumber?: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { pageNumber } = req.query as IndexQuery;

  const { personfacts, count, hasMore } = await ListPersonfactService({
    pageNumber
  });

  return res.json({ personfacts, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const data = req.body;

  const personfact = await StorePersonfactService(data);

  return res.status(200).json(personfact);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const personfact = await ShowPersonfactService(id);

  return res.status(200).json(personfact);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const data = req.body;

  const personfact = await UpdatePersonfactService({ data, id: id });

  return res.status(200).json(personfact);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  await DeletePersonfactService(id);

  return res.status(200).json({ message: "Personfact deleted" });
};
