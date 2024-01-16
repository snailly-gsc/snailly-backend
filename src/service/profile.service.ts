import { PrismaClient } from "@prisma/client";
import { errorHandle } from "../utils";
import { updateProfileSchema } from "../utils/validator";
import type { UpdateProfile } from "../types";
import argon2 from 'argon2';
import { get } from "http";
const prisma = new PrismaClient()

export class ProfileService {  
  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  private checkPassword(password: string , hashPassword: string ) {
    return argon2.verify(hashPassword, password)
  }

  private hashData(data: any) {
    return argon2.hash(data)
  }

  async updateProfile(id: string, payload: UpdateProfile) {
    const validateArgs = updateProfileSchema.safeParse({
      ...payload,
      id
    })
    if(!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try{
      let password = ''
      const getData = await prisma.parents.findUnique({
        where: {
          id
        }
      })
      if(!getData) return this.failedOrSuccessRequest('failed', 'Data not found')
      
      if(getData.email !== payload.email) {
        const checkEmail = await prisma.parents.findFirst({
          where: {
            email: payload.email
          }
        })
        if(checkEmail) return this.failedOrSuccessRequest('failed', 'Email Sudah Digunakan')
      }

      if(payload.newPassword !== undefined && payload.oldPassword !== undefined && payload.confirmPassword !== undefined) {
        const checkPassword = await this.checkPassword(payload.oldPassword, getData.password)
        if(!checkPassword) return this.failedOrSuccessRequest('failed', 'Password Salah')  
        password = await this.hashData(payload.newPassword)
      }else{
        password = getData.password
      }

      const updateProfile = await prisma.parents.update({
        where: {
          id
        },
        data: {
          name: payload.name,
          email: payload.email,
          password
        }
      })
      return this.failedOrSuccessRequest('success', updateProfile)
    }catch(error){
      return this.failedOrSuccessRequest('failed', error)
    }
  }

}