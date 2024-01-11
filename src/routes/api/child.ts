import { Router } from "express";
import { get, getById, store, destroy, update } from '../../controllers/child.controller';
import { requireUser } from "../../middleware/requireUser";
const router = Router();

router.post("/", requireUser, store)
router.get("/", requireUser, get)
router.get("/:id", requireUser, getById)
router.put("/:id", requireUser, update)
router.delete("/:id", requireUser, destroy)

export default router;