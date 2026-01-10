import { Router } from "express";
import * as SettingController from "../controllers/SettingController";

const settingRoutes = Router();

const basePath = "/setting";

settingRoutes.get(basePath, SettingController.index);
settingRoutes.post(basePath, SettingController.store);
settingRoutes.put(`${basePath}/:id`, SettingController.update);
settingRoutes.get(`${basePath}/:id`, SettingController.show);
settingRoutes.delete(`${basePath}/:id`, SettingController.remove);

export default settingRoutes;
