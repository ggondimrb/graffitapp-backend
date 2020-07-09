import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import GraffitiController from "./app/controllers/GraffitiController";
import ArtLocalizationController from "./app/controllers/ArtLocalizationController";
import authMiddleware from "./app/middlewares/auth";
import multer from "multer";
import multerConfig from "./config/multer";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);
// rotas que precisam do middleware
routes.put("/users", UserController.update);

routes.post("/files/:id", upload.single("file"), FileController.store);

routes.post("/graffitis", GraffitiController.store);
routes.get("/graffitis", GraffitiController.index);
routes.get("/graffitis/:id", GraffitiController.indexOne);
routes.delete("/graffitis/:id", GraffitiController.delete);

routes.get("/artLocalization", ArtLocalizationController.index);

export default routes;
