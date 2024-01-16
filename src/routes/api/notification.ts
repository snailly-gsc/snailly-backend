import { Router } from "express";
import { sendNotification, get, getById } from '../../controllers/notification.controller';
const router = Router();

router.get("/", get)
router.get("/:id", getById)
router.post("/send", sendNotification)
export default router;