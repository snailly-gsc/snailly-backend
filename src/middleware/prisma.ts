import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
  // Soft delete
  prisma.$use(async(params,next) => {
    // Check incoming query type
    if (params.model == 'child' as string) {
      if (params.action == 'delete') {
        // Delete queries
        // Change action to an update
        params.action = 'update'
        params.args['data'] = { deletedAt: new Date() }
      }
      if (
        params.action == 'findUnique' || params.action == 'findFirst' || params.action == 'findMany'
      ){
        // Get queries
        // Add a where clause to filter out deleted items
        if (params.args.where != undefined) {
          params.args.where['deletedAt'] = null
        } else {
          params.args['where'] = { deletedAt: null }
        }
      }
      if (params.action == 'deleteMany') {
        // Delete many queries
        params.action = 'updateMany'
        if (params.args.data != undefined) {
          params.args.data['deleted'] = true
        } else {
          params.args['data'] = { deleted: true }
        }
      }
    }
    return next(params)
  })
}
main()
export default prisma