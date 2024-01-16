import { Request, Response } from 'express';
import { getResponse, getHttpCode } from '../utils';
import { NotificationService, LogService } from '../service';

const notificationService = new NotificationService()

const get = async (req: Request, res: Response) => {
  const parentId = req.user?.id
  const response = await notificationService.getNotification(parentId)
  if(response.status === 'failed'){
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, "Gagal Mengambil Notifikasi", response.data)
  } 
  return getResponse(res, getHttpCode.OK, "Berhasil Mengambil Notifikasi", response.data)
}

const getById = async (req:Request, res:Response) => {
  const id = req.params.id
  const response = await notificationService.getNotificationById(id)
  if(response.status === 'failed'){
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, "Gagal Mengambil Notifikasi", response.data)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Mengambil Notifikasi", response.data)
}

const sendNotification = async (req: Request, res: Response) => {
  const payload = {
    childId: req.body.childId,
    parentId: req.body.parentId,
    logId: req.body.logId,
    web_title: req.body.web_title
  }
  const response = await notificationService.sendNotification(payload)

  if (response.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, "Gagal Mengirimkan Notifikasi Ke Orang Tua", response.data)
  }

  return getResponse(res, getHttpCode.OK, "Berhasil Mengirimkan Notifikasi Ke Orang Tua", response.data)
}



export {
  get,
  getById,
  sendNotification,
}