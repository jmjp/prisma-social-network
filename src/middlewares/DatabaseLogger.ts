import { v4 as uuidv4 } from 'uuid';
import { blue, blueBright, green, red, cyan, yellow } from 'chalk';
import { Prisma } from '@prisma/client';

const loggerDB = async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
  const id = uuidv4();
  const idText = blue(`[${id}]`);
  const now = new Date();
  const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const timeStampText = cyan(`[${timestamp}]`);
  const before = Date.now()

  const result = await next(params)

  const after = Date.now()

  const timeText = blue(`${(after - before).toFixed(2)}ms`)

  console.log(`${yellow("[Database]")}${idText}${timeStampText} ${params.model} ${params.action} ${timeText}`);

  return result
};

export { loggerDB };