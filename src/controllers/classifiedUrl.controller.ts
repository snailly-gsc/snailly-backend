import {Request, Response} from 'express';
import {getResponse, getHttpCode} from '../utils';
import { ClassifiedUrlService } from '../service';

const classifiedUrlService = new ClassifiedUrlService()

const getDangerousWebsite = async (req: Request, res: Response) => {
  const result = await classifiedUrlService.getDangerousWebsite()
  if(result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data Website Berbahaya", result.data)
}

const getDangerousWebsiteByParentId = async (req: Request, res: Response) => {
  const parentId = req.params.parentId
  const domain =  req.query.domain ? new URL(req.query.domain as string).hostname.replace('www.','') : null
  const result = domain ==null ?await classifiedUrlService.getDengerousWebsiteByParentId(parentId):await classifiedUrlService.getDangerousWebsiteByParentId(parentId, domain)
  if(result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data Website Berbahaya", result.data)
}

export {
  getDangerousWebsite,
  getDangerousWebsiteByParentId
}