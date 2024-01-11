import { Request, Response } from 'express';
import { getResponse, getHttpCode } from '../utils';
import { ChildService } from '../service';

const childService = new ChildService()

const get = async (req: Request, res: Response) => {
  const id = req.user?.id
  const result = await childService.getChild(id)

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }

  return getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data Anak", result.data)
}

const getById = async (req: Request, res: Response) => {
  const id = req.params.id
  const parentId = req.user?.id
  const result = await childService.getChildById(id, parentId)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data Anak", result.data)

}

const store = async (req: Request, res: Response) => {
  const { id } = req.user as any
  const payload = {
    ...req.body,
  }
  const result = await childService.createChild(payload, id)

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }

  return getResponse(res, getHttpCode.OK, "Berhasil Menambahkan Anak", result.data)
}

const update = async (req: Request, res: Response) => {
  const id = req.params.id
  const payload = {
    ...req.body,
  }

  const result = await childService.updateChild(payload,id)

  if(result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }

  return getResponse(res, getHttpCode.OK, "Berhasil Mengubah Data Anak", result.data)
}

const destroy = async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await childService.deleteChild(id)
  if(result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Menghapus Data Anak", result.data)
}


export {
  get,
  getById,
  store,
  update,
  destroy
}