import { Request, Response } from 'express';
import { getResponse, getHttpCode } from '../utils';
import { AuthService } from '../service';
const authService = new AuthService()

const login = async (req: Request, res: Response) => {
  const { email, password, registrationToken } = req.body
  const result = await authService.login({ email, password, registrationToken })
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNAUTHORIZED, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Login", result.data)
}

const register = async (req: Request, res: Response) => {
  const payload = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  }
  const result = await authService.register(payload)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Membuat Akun", result.data)
}

const me = async (req: Request, res: Response) => {
  const user = req.user
  if (!user) {
    return getResponse(res, getHttpCode.FORBIDDEN, 'Unauthorized', {});
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Mendapatkan Data User", user)
}


const logout = async (req: Request, res: Response) => {
  const user = req.user
  if (!user) {
    return getResponse(res, getHttpCode.FORBIDDEN, 'Unauthorized', {});
  }

  const id = user.id;
  const result = await authService.logout(id)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNAUTHORIZED, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, "Berhasil Logout", result.data)
}

export {
  register,
  login,
  logout,
  me
}