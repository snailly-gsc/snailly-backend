import { Router } from "express";
import { Server } from "socket.io";

import auth from "./api/auth";
import child from "./api/child";
import log from "./api/log";
import classifiedUrl  from "./api/classifiedUrl";

const dataRoutes = (io: Server) => {
  const router = Router();
  router.use("/auth", auth);
  router.use("/child", child)
  router.use("/log", log)
  router.use("/classified-url", classifiedUrl)
  return router;
}

export default dataRoutes;