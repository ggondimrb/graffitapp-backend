import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import GraffitiController from "./app/controllers/GraffitiController";
import LikeController from "./app/controllers/LikeController";
import CommentController from "./app/controllers/CommentController";
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
routes.get("/graffitisByUser", GraffitiController.indexByUser);
routes.delete("/graffitis/:id", GraffitiController.delete);

routes.post("/like", LikeController.store);
routes.get("/like/:graffiti_id", LikeController.indexOne);
routes.delete("/like/:id", LikeController.delete);

routes.post("/comment", CommentController.store);
routes.get("/comment/:graffiti_id", CommentController.index);
routes.delete("/comment/:id", CommentController.delete);

export default routes;
