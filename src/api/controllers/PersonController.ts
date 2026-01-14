import { Request, Response } from "express";
import DeletePersonService from "../../services/PersonServices/DeletePersonService";
import ListPersonService from "../../services/PersonServices/ListPersonService";
import ShowPersonService from "../../services/PersonServices/ShowPersonService";
import StorePersonService from "../../services/PersonServices/StorePersonService";
import UpdatePersonService from "../../services/PersonServices/UpdatePersonService";


type IndexQuery = {
  pageNumber?: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { pageNumber } = req.query as IndexQuery;

  const { persons, count, hasMore } = await ListPersonService({
    pageNumber: +(pageNumber ?? 1)
  });

  return res.json({ persons, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const data = req.body;

  const person = await StorePersonService(data);

  return res.status(200).json(person);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const person = await ShowPersonService(`${id}`);

  return res.status(200).json(person);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const data = req.body;

  const person = await UpdatePersonService({ data, id: `${id}` });

  return res.status(200).json(person);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  await DeletePersonService(`${id}`);

  return res.status(200).json({ message: "Person deleted" });
};
