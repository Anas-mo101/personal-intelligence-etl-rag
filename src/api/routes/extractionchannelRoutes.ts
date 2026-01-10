import { Router } from "express";
import * as ExtractionChannelController from "../controllers/ExtractionChannelController";

const extractionchannelRoutes = Router();

const basePath = "/extraction-channel";

extractionchannelRoutes.get(basePath, ExtractionChannelController.index);
extractionchannelRoutes.post(basePath, ExtractionChannelController.store);
extractionchannelRoutes.put(`${basePath}/:id`, ExtractionChannelController.update);
extractionchannelRoutes.get(`${basePath}/:id`, ExtractionChannelController.show);
extractionchannelRoutes.delete(`${basePath}/:id`, ExtractionChannelController.remove);

export default extractionchannelRoutes;
