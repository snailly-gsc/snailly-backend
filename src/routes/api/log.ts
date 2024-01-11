import { Router } from "express";
import { get, store,summary, grantAccess, statisticYear, statisticMonth } from '../../controllers/log.controller';
import { requireUser } from "../../middleware/requireUser";
import { Server } from 'socket.io';
const router = Router();
router.get("/summary/:childId", requireUser, summary)
router.get("/:childId", requireUser, get)
router.get("/statistic-year/:childId", requireUser, statisticYear)
router.get("/statistic-month/:childId", requireUser, statisticMonth)
router.post("/", requireUser, store)
router.put("/grant-access/:logId", requireUser, grantAccess)
router.post("/grant-access/:logId", requireUser, grantAccess)
export default router;