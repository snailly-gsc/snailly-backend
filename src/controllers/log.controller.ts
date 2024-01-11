import { Request, Response } from 'express';
import { getResponse, getHttpCode } from '../utils';
import { LogService } from '../service';
import moment from 'moment'
const logService = new LogService()

const summary = async (req: Request, res: Response) => {
  const childId = req.params.childId
  const{id:userId}:any = req.user
  const result = await logService.getSummary(childId, userId)
  getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data Summary", result)
}

const statisticYear = async (req: Request, res: Response) => {
  const childId = req.params.childId as string
  const year = req.query.year as string
  const parentId = req.user?.id
  const result = await logService.getStatisticYear(childId, parentId, year)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data Log", result.data)
}

const statisticMonth = async (req: Request, res: Response) => {
  const childId = req.params.childId as string
  const date = req.query.date as string
  const parentId = req.user?.id
  const result = await logService.getStatisticMonth(childId, parentId, date)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data Log", result.data)
}

const get = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as any) || 1
  const limit = parseInt(req.query.limit as any) || 10
  const childId = req.params.childId
  const { period, month, year,date } = req.query as { period: string, month: string, year: string,date: string }
  const {id:userId}:any = req.user
  const result = await logService.getLog(userId,childId, period, month, year, page, limit,date)

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }

  return getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data Log", result.data)
}

const store = async (req: Request, res: Response) => {
  const data = req.body
  const result = await logService.storeLog(data)
  if(result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Menambahkan Data Log", result.data)
}

const grantAccess = async (req: Request, res:Response) => {
  const logId = req.params.logId
  const { grantAccess } = req.body
  const response = await logService.grantAccess(logId, grantAccess)
  if (response.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, "Gagal Mengubah Akses", response.data)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Mengubah Akses", response.data) 
}

export {
  get,
  store,
  summary,
  grantAccess,
  statisticYear,
  statisticMonth
}