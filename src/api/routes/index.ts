import { Router } from "express";
import extractionchannelRoutes from "./extractionchannelRoutes";
import personfactRoutes from "./personfactRoutes";
import personRoutes from "./personRoutes";
import settingRoutes from "./settingRoutes";


const routes = Router();

routes.use("/", extractionchannelRoutes);
routes.use("/", personfactRoutes);
routes.use("/", personRoutes);
routes.use("/", settingRoutes);

export default routes;
