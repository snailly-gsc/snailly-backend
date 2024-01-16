import { PrismaClient } from "@prisma/client";
import * as admin from 'firebase-admin';
import { NotificationInput } from "../types";
import { getNotificationSchema } from "../utils/validator";
const serviceAccount = require('../../google.service.json')
const prisma = new PrismaClient()
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export class NotificationService {

  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  async getNotification(parentId: string){
    try{
      const data = await prisma.notifications.findMany({
        where: {
          parentId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return this.failedOrSuccessRequest('success', data)
    }catch(error){
      return this.failedOrSuccessRequest('failed',error)
    }
  }

  async getNotificationById(id: string){
    try{
      const data = await prisma.notifications.findUnique({
        where: {
          id
        }
      })
      if(!data) return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan')
      return this.failedOrSuccessRequest('success', data)
    }catch(error){
      return this.failedOrSuccessRequest('failed',error)
    }
  }

  async sendNotification(payload: NotificationInput) {
    try {
      const child = await prisma.child.findUnique({
        where: {
          id: payload.childId
        }
      })

      const parentDevice = await prisma.parents_device.findFirst({
        where: {
          parentsId: payload.parentId
        }
      })

      const message: any = {
        data: {
          id: payload.logId,
        },
        notification: {
          title: 'Log Activity',
          body: `Oh tidak! ${child?.name} mengakses ${payload.web_title} harus mengizinkan akses?`
        },
        token: parentDevice?.deviceToken
      }
      const data = await admin.messaging().send(message)
      await prisma.notifications.create({
        data: {
          parentId: payload.parentId,
          childId: payload.childId,
          logId: payload.logId,
          title: message.notification.title,
          text: message.notification.body,
        }
      })
      return this.failedOrSuccessRequest('success', null)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

}