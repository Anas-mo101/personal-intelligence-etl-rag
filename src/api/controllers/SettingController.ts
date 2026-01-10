import { Request, Response } from "express";
import DeleteSettingService from "../../services/SettingServices/DeleteSettingService";
import ListSettingService from "../../services/SettingServices/ListSettingService";
import ShowSettingService from "../../services/SettingServices/ShowSettingService";
import StoreSettingService from "../../services/SettingServices/StoreSettingService";
import UpdateSettingService from "../../services/SettingServices/UpdateSettingService";

type IndexQuery = {
  pageNumber?: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { pageNumber } = req.query as IndexQuery;

  const { settings, count, hasMore } = await ListSettingService({
    pageNumber
  });

  return res.json({ settings, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const data = req.body;

  const setting = await StoreSettingService(data);

  return res.status(200).json(setting);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const setting = await ShowSettingService(id);

  return res.status(200).json(setting);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const data = req.body;

  const setting = await UpdateSettingService({ data, id: id });

  return res.status(200).json(setting);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  await DeleteSettingService(id);

  return res.status(200).json({ message: "Setting deleted" });
};
