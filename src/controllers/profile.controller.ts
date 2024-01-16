import { Request, Response } from 'express';
import { getResponse, getHttpCode } from '../utils';
import { ProfileService } from '../service';

const profileService = new ProfileService()

const update = async (req: Request, res: Response) => {
  const user = req.user
  if (!user) {
    return getResponse(res, getHttpCode.FORBIDDEN, 'Unauthorized', {});
  }
  const id = req.params.id
  const payload = {
    name: req.body.name,
    email: req.body.email,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
    confirmPassword: req.body.confirmPassword,
  }
  const result = await profileService.updateProfile(id, payload)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Update Profile", result.data)
}

export {
  update
}