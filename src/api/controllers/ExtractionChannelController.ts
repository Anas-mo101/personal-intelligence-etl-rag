import { Request, Response } from "express";
import ListExtractionChannelService from "../../services/ExtractionChannelServices/ListExtractionChannelService";
import DeleteExtractionChannelService from "../../services/ExtractionChannelServices/DeleteExtractionChannelService";
import ShowExtractionChannelService from "../../services/ExtractionChannelServices/ShowExtractionChannelService";
import StoreExtractionChannelService from "../../services/ExtractionChannelServices/StoreExtractionChannelService";
import UpdateExtractionChannelService from "../../services/ExtractionChannelServices/UpdateExtractionChannelService";

type IndexQuery = {
  searchParam?: string;
  pageNumber?: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { pageNumber } = req.query as IndexQuery;

  const { extractionchannels, count, hasMore } = await ListExtractionChannelService({
    pageNumber: pageNumber
  });

  return res.json({ extractionchannels, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const data = req.body;

  const extractionchannel = await StoreExtractionChannelService(data);

  return res.status(200).json(extractionchannel);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const extractionchannel = await ShowExtractionChannelService(id);

  return res.status(200).json(extractionchannel);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const data = req.body;

  const extractionchannel = await UpdateExtractionChannelService({ data, id: id });

  return res.status(200).json(extractionchannel);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  await DeleteExtractionChannelService(id);

  return res.status(200).json({ message: "ExtractionChannel deleted" });
};
