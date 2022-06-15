import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { blue, blueBright, green, red, cyan, yellow} from 'chalk';


const getProcessingTimeInMS = (time: [number, number]): string => {
  return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
}
function loggerHTTP(req: Request, res: Response, next: NextFunction) {
  const id = uuidv4();
  const now = new Date();
  const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const { method, path } = req;
  const start = process.hrtime();
  const idText = blue(`[${id}]`);
  const timeStampText = cyan(`[${timestamp}]`);
  console.log(`${yellow("[HTTP]")}${idText}${timeStampText} ${method}:${path}`);

  res.once('finish', () => {
    const end = process.hrtime(start);
    const endText = blue(`${getProcessingTimeInMS(end)}`);
    const statusCode = res.statusCode == 200 ? green(`${res.statusCode}`) : red(`${res.statusCode}`);
    console.log(`${yellow("[HTTP]")}${idText}${timeStampText} ${method}:${path} ${statusCode} ${endText}`);
  });
  next();
};

  export { loggerHTTP };