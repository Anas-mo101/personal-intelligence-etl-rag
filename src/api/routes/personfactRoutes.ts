import { Router } from "express";
import * as PersonfactController from "../controllers/PersonfactController";

const personfactRoutes = Router();

const basePath = "/person-fact";

personfactRoutes.get(basePath, PersonfactController.index);
personfactRoutes.post(basePath, PersonfactController.store);
personfactRoutes.put(`${basePath}/:id`, PersonfactController.update);
personfactRoutes.get(`${basePath}/:id`, PersonfactController.show);
personfactRoutes.delete(`${basePath}/:id`, PersonfactController.remove);

export default personfactRoutes;
