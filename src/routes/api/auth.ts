import { Router } from "express";
import { register, login, logout, me } from '../../controllers/auth.controller';
import { requireUser } from "../../middleware/requireUser";
const router = Router();


router.post("/register", register);
router.post("/login", login)
router.get('/me', requireUser, me)
router.post('/logout', requireUser, logout)

export default router;