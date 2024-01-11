import { PrismaClient } from "@prisma/client";
import type { RegisterInput, LoginInput } from "../types/auth";
import { registerSchema, loginSchema } from '../utils/validator'
import { errorHandle } from "../utils";
import argon2 from 'argon2';
import { signJWT } from "../config";

const prisma = new PrismaClient()
export class AuthService {

  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  private hashData(data: string) {
    return argon2.hash(data)
  }

  private checkEmail(email: string) {
    return prisma.parents.findUnique({
      where: {
        email
      }
    })
  }

  private async storeToken(userId: string, token: string, type: string) {
    if (type === 'parents') {

      const parentsDevice = await prisma.parents_device.findFirst({
        where: {
          parentsId: userId
        }
      })

      return prisma.parents_device.update({
        where: {
          id: parentsDevice?.id
        },
        data: {
          deviceToken: token
        }
      })
    } else {
      return prisma.child_device.update({
        where: {
          id: userId
        },
        data: {
          deviceToken: token
        }
      })
    }
  }

  async login(payload: LoginInput) {
    const validateArgs = loginSchema.safeParse(payload)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error));
    }
    try {
      const login = await prisma.parents.findUnique({
        where: {
          email: payload.email
        }
      })
      if (!login) {
        return this.failedOrSuccessRequest('failed', 'Email Tidak Terdaftar')
      }

      const verifyPassword = await argon2.verify(login.password, payload.password)
      if (!verifyPassword) {
        return this.failedOrSuccessRequest('failed', 'Email Atau Password Salah')
      }

      const accessToken = signJWT({ id: login.id, email: login.email, name: login.name }, '1d')
      const refreshToken = signJWT({ id: login.id, email: login.email, name: login.name }, '7d')


      await this.storeToken(login.id, payload.registrationToken, 'parents')

      return this.failedOrSuccessRequest('success', {
        accessToken,
        refreshToken
      })

    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async register(payload: RegisterInput) {
    const validateArgs = registerSchema.safeParse(payload)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error));
    }
    try {

      const checkEmail = await this.checkEmail(payload.email)

      if (checkEmail) {
        return this.failedOrSuccessRequest('failed', 'Email Sudah Terdaftar')
      }

      const hashPassword = await this.hashData(payload.password)
      const data = await prisma.parents.create({
        data: {
          email: payload.email,
          name: payload.name,
          password: hashPassword
        }
      })

      await prisma.parents_device.create({
        data: {
          parentsId: data.id,
          deviceToken: ''
        }
      })

      return this.failedOrSuccessRequest('success', data)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }



  async logout(id: string) {
    try {

      const parentsDevice = await prisma.parents_device.findFirst({
        where: {
          parentsId: id
        }
      })

      await prisma.parents_device.update({
        where: {
          id: parentsDevice?.id
        },
        data: {
          deviceToken: ''
        }
      })
      return this.failedOrSuccessRequest('success', 'Berhasil Logout')
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }


}