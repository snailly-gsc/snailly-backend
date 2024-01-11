import { PrismaClient } from "@prisma/client";
import { errorHandle } from "../utils";
import { createLogSchema, getLogSchema } from "../utils/validator";
import { LogInput, GrantAccessInput } from "@/types";
import moment from 'moment'
const prisma = new PrismaClient()

export class LogService {

  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  } 

  async getLog(userId:string,childId: string, period: string, month: string, year: string, page: number, limit: number,date: string) {
    const validateArgs = getLogSchema.safeParse({childId, period})
    if (validateArgs.success === false) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      let condition: object = { childId }
      if (childId === 'ALL') {
        const childs = await prisma.child.findMany({
          where: {
            parentsId: userId
          },
          select: {
            id: true
          }
        })
        condition = {
          childId: {
            in: childs.map((child: any) => child.id)
          }
        }
      }
      switch (period) {
        case 'daily':
          condition = {
			...condition,
			createdAt: {
				gte: new Date(
					new Date(`${year}-${month}-${date}`).setHours(0, 0, 0)
				),
				lte: new Date(
					new Date(`${year}-${month}-${date}`).setHours(23, 59, 59)
				),
			},
		};
          break;
        case 'monthly':
          // if month and year
          if(!month || !year) return this.failedOrSuccessRequest('failed', 'Month and Year is required' )
          condition = {
            ...condition, 
            createdAt: {
              gte: new Date(new Date().setFullYear(+year,+month-1,1)),
              lt: new Date(new Date().setFullYear(+year,+month-1,31))
            }
          }
          break;
        default:
          break;
      }
      const data = await prisma.log_activity.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { ...condition },
        select:{
          log_id:true,
          childId:true,
          url:true,
          grant_access:true,
          createdAt:true,
          updatedAt:true,
          classified_url:{
            select:{
              FINAL_label:true,
              title:true,
              description:true,
              title_raw:true,
            }
          },
          child: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      const totalPage = Math.ceil((await prisma.log_activity.count({ where: { ...condition } })) / limit)
      return this.failedOrSuccessRequest('success', { items:data, total: data.length, page, limit, totalPage})
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }
  async getSummary(childId: string,userId:string) {
  const websites:string[] = await prisma.$queryRaw`
    SELECT "classified_url"."title", "classified_url"."FINAL_label", "log_activity"."url", "log_activity"."childId"
    FROM "classified_url"
    INNER JOIN "log_activity" ON "classified_url"."log_id" = "log_activity"."log_id"
   ;
  `;
    let websiteFiltered:string[] = [...websites]
    if (childId !== 'ALL') {
      websiteFiltered = websites.filter((website: any) => website.childId === childId)
    } else {
      const childs = await prisma.child.findMany({
        where: {
          parentsId: userId
        },
        select: {
          id: true
        }
      })
      websiteFiltered = websites.filter((website: any) => childs.some((child: any) => child.id === website.childId))
    }
    
    const safeWebsite: string[] = websiteFiltered.filter((website:any) => website.FINAL_label === 'aman');
    const dangerousWebsite: string[] = websiteFiltered.filter((website: any) => website.FINAL_label === 'berbahaya');
    
    const totalSafeWebsites:number = safeWebsite.length;
    const totalDangerousWebsites:number = dangerousWebsite.length;
    const totalWebsite = totalSafeWebsites + totalDangerousWebsites
    
    const persentageSafeWebsite = (totalSafeWebsites / totalWebsite) * 100 || 0
    const persentageDangerousWebsite = (totalDangerousWebsites / totalWebsite) * 100 ||0

    return {totalSafeWebsites,totalDangerousWebsites,persentageSafeWebsite,persentageDangerousWebsite}
  }

  async getStatisticYear(childId: string, parentId: string, year: string) {
    const websites:[] = await prisma.$queryRaw`
      SELECT "classified_url"."title", "classified_url"."FINAL_label", "log_activity"."url", "log_activity"."childId",
      "log_activity"."createdAt", "log_activity"."parentId"
      FROM "classified_url"
      INNER JOIN "log_activity" ON "classified_url"."log_id" = "log_activity"."log_id"
      WHERE "log_activity"."parentId" = ${parentId} AND "log_activity"."createdAt" >= ${new Date(new Date().setFullYear(+year, 0, 1))} AND "log_activity"."createdAt" <= ${new Date(new Date().setFullYear(+year, 11, 31))}
    `
    let websiteFiltered:string[] = [...websites]
    //total safe and dangerous website in a month
    websiteFiltered = websiteFiltered.map((website:any) => {
      const date = new Date(website.createdAt)
      return {
        ...website,
        month: date.getMonth()
      }
    }).filter((websites:any) => childId === 'ALL' ? websites : websites.childId === childId)
    let data:any = []
    for(let i = 0; i < 12; i++){
      const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli','Agustus','September','Oktober','November','Desember']
      const safe = websiteFiltered.filter((website:any) => website.FINAL_label === 'aman' && website.month === i)
      const dangerous = websiteFiltered.filter((website:any) => website.FINAL_label === 'berbahaya' && website.month === i)
      data.push({
        month: month[i],
        Good: safe.length,
        Bad: dangerous.length,
      })
    } 
    return this.failedOrSuccessRequest('success', data)
  }

  async getStatisticMonth(childId: string , parentId: string, date: string) {
    const month = parseInt(moment(date).format('M'))
    const year = parseInt(moment(date).format('YYYY'))
    const websites:[] = await prisma.$queryRaw`
      SELECT "classified_url"."title", "classified_url"."FINAL_label", "log_activity"."url", "log_activity"."childId",
      "log_activity"."createdAt", "log_activity"."parentId"
      FROM "classified_url"
      INNER JOIN "log_activity" ON "classified_url"."log_id" = "log_activity"."log_id"
      WHERE "log_activity"."parentId" = ${parentId} AND
      EXTRACT(MONTH FROM "log_activity"."createdAt") = ${month} AND EXTRACT(YEAR FROM "log_activity"."createdAt") = ${year}
    `
    let websiteFiltered:string[] = [...websites]
    //total safe and dangerous website in a month
    websiteFiltered = websiteFiltered.filter((websites:any) => childId === 'ALL' ? websites : websites.childId === childId)
    const safeWebsite: string[] = websiteFiltered.filter((website:any) => website.FINAL_label === 'aman');
    const dangerousWebsite: string[] = websiteFiltered.filter((website: any) => website.FINAL_label === 'berbahaya');

    const totalSafeWebsites:number = safeWebsite.length;
    const totalDangerousWebsites:number = dangerousWebsite.length;

    const data = [
      {
        name: 'Good',
        value: totalSafeWebsites,
      },
      {
        name: 'Bad',
        value: totalDangerousWebsites,
      },
    ]
    return this.failedOrSuccessRequest('success', data)
  }

  async storeLog(payload: LogInput) {
    const validateArgs = createLogSchema.safeParse(payload)
    if (validateArgs.success === false) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      let origin = (new URL(payload.url)).origin
      const logActivity = await prisma.log_activity.create({
        data: {
          parentId: payload.parentId,
          childId: payload.childId,
          web_title: payload.web_title,
          detail_url: payload.url,
          url: origin,
          web_description: payload.web_description
        },
        include: {
          classified_url: true
        }
      })
      const classifiedUrl = logActivity.classified_url
      if (classifiedUrl.length ===0) {
        const urlClassification = await prisma.url_classification.findFirst({
          where: {
            url: origin
          }
        })
        if (urlClassification) {
          await prisma.classified_url.create({
            data: {
              log_id: logActivity.log_id,
              title: payload.web_title,
              FINAL_label:urlClassification.label ,
              description: payload.web_description,
              title_raw: payload.web_title,
            }
          })
        }
      }

      return this.failedOrSuccessRequest('success', logActivity)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async grantAccess(id : string, grantAccess: String){
    let grant = grantAccess.toLowerCase() === 'true' ? true : false
    try {
      const data = await prisma.log_activity.update({
        where:{
          log_id: id
        },
        data:{
          grant_access: grant
        }
      })
      // update all log activity with same url and parent_id
      await prisma.log_activity.updateMany({
        where:{
          url: data.url,
          parentId: data.parentId
        },
        data:{
          grant_access: grant
        }
      })
      return this.failedOrSuccessRequest('success', data)
    } catch (error) {
      console.log(error)
      return this.failedOrSuccessRequest('failed', error)
    }
  }

}