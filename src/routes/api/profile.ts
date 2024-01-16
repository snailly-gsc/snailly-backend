import {Router} from "express";
import {update} from '../../controllers/profile.controller';
const router = Router();

router.put("/:id", update)

export default router;