import { Router } from "express";
import { getDangerousWebsite, getDangerousWebsiteByParentId  } from '../../controllers/classifiedUrl.controller';
const router = Router();

router.get("/dangerous-website", getDangerousWebsite)
router.get("/dangerous-website/:parentId", getDangerousWebsiteByParentId)
export default router;