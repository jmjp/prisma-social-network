import { PrismaClient } from '@prisma/client'
import { loggerDB } from '../middlewares/DatabaseLogger';


const prismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

prismaClient.$use(loggerDB)

export { prismaClient };