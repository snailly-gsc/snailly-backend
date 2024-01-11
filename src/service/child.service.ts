import { errorHandle } from "../utils";
import type { ChildrenInput } from "../types";
import { createChildSchema, getChildSchema, updateChildSchema } from "../utils/validator";
import prisma  from "../middleware/prisma";
export class ChildService {

  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  async getChild(parentId: string) {
    try {
      const data = await prisma.child.findMany({
        where: {
          parentsId: parentId,
        }
      })
      return this.failedOrSuccessRequest('success', data)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async getChildById(childId: string, parentId: string) {
    const validateArgs = getChildSchema.safeParse({ childId })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      const data = await prisma.child.findFirst({
        where: {
          id: childId,
          parentsId: parentId
        }
      })
      return this.failedOrSuccessRequest('success', data)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async createChild(payload: ChildrenInput, parentId: string) {
    const validateArgs = createChildSchema.safeParse(payload)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      const data = await prisma.child.create({
        data: {
          parentsId: parentId,
          name: payload.name,
        }
      })
      return this.failedOrSuccessRequest('success', data)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async updateChild(payload: ChildrenInput, childId: string) {
    const validateArgs = updateChildSchema.safeParse({ ...payload, childId })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try{
      const data = await prisma.child.update({
        where: {
          id: childId
        },
        data: {
          name: payload.name
        }
      })
      return this.failedOrSuccessRequest('success', data)
    }catch(error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async deleteChild(childId: string) {
    const validateArgs = getChildSchema.safeParse({ childId })
    if(!validateArgs.success){
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try{
      const data = await prisma.child.delete({
        where: {
          id: childId
        }
      })
      if(!data){
        return this.failedOrSuccessRequest('failed', 'Data Anak Tidak Ditemukan')
      }
      return this.failedOrSuccessRequest('success', data)
    }catch(error){
      return this.failedOrSuccessRequest('failed', error)
    }
  }
}