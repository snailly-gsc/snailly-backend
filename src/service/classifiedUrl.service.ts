import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export class ClassifiedUrlService {
  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }
  async getDangerousWebsite() {
    try{
      const classifiedUrl : any = await prisma.$queryRaw`
        SELECT "log_activity"."url"
        FROM "classified_url"
        INNER JOIN "log_activity"  ON "classified_url"."log_id" = "log_activity"."log_id" 
        WHERE "FINAL_label" = 'berbahaya'
        GROUP BY "classified_url"."title", "classified_url"."FINAL_label", "log_activity"."url"
      `
      const data = classifiedUrl.map((item:any) => {
        return {
          url: item.url,
          FINAL_label: 'berbahaya'
        }
      })
      return this.failedOrSuccessRequest('success', data)
    }catch(error){
      return this.failedOrSuccessRequest('failed', error)
    }
  }
  async getDengerousWebsiteByParentId(parentId: string) {
    try {
      const data:any = await prisma.$queryRaw`
      SELECT DISTINCT url FROM (
    SELECT url
    FROM log_activity
    WHERE "parentId" = ${parentId} AND "grant_access" = false
) AS combined_result`;
      const dataMaped = data.map((item: { url: string }) => item.url);
      return this.failedOrSuccessRequest('success', dataMaped);
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }
  async getDangerousWebsiteByParentId(parentId: string, domain: any){
    try{

      let tempData : any = domain === null ? await prisma.$queryRaw`
      SELECT "classified_url"."title", "classifieddata_url"."FINAL_label", "log_activity"."url", "log_activity"."grant_access"
      FROM "classified_url"
      INNER JOIN "log_activity"  ON "classified_url"."log_id" = "log_activity"."log_id"
      WHERE "FINAL_label" = 'berbahaya' OR "grant_access" = false AND "parentId" = ${parentId} 
      GROUP BY "classified_url"."title", "classified_url"."FINAL_label", "log_activity"."url", "log_activity"."grant_access"
      ` : await prisma.$queryRaw`SELECT "combined_url", "FINAL_label", "grant_access"
      FROM (
        SELECT "log_activity"."url" AS "combined_url", "classified_url"."FINAL_label", "log_activity"."grant_access"
        FROM "classified_url"
        INNER JOIN "log_activity" ON "classified_url"."log_id" = "log_activity"."log_id"
        WHERE "FINAL_label" = 'berbahaya' OR "grant_access" = false AND "parentId" = ${parentId} 
        GROUP BY "classified_url"."title", "classified_url"."FINAL_label", "log_activity"."url", "log_activity"."grant_access"
        UNION SELECT   "internet_positif"."url" AS "combined_url", 'berbahaya' AS "final_label", false AS "grant_access"
        FROM "internet_positif"
      ) AS "combined_data"
      WHERE "combined_url" LIKE CONCAT('%', ${domain} , '%')`
        
      const data = tempData.map((item:any) => {
        return {
          url: item.combined_url,
          FINAL_label: item.grant_access === true ? 'aman' : 'berbahaya',
          grant_access: item.grant_access
        }
      }).filter((item:any) => item.FINAL_label === 'berbahaya')

      return this.failedOrSuccessRequest('success', data)
    }catch(error){
      console.log(error)
      return this.failedOrSuccessRequest('failed', error)
    }
  }
}