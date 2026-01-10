import { Router } from "express";
import * as PersonController from "../controllers/PersonController";

const personRoutes = Router();

const basePath = "/person";

personRoutes.get(basePath, PersonController.index);
personRoutes.post(basePath, PersonController.store);
personRoutes.put(`${basePath}/:id`, PersonController.update);
personRoutes.get(`${basePath}/:id`, PersonController.show);
personRoutes.delete(`${basePath}/:id`, PersonController.remove);

export default personRoutes;
