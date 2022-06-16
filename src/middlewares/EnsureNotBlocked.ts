import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../database/database';

async function ensureNotBlocked(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ error: 'No token provided' });
    }
    const [prefix,token] =  authHeader.split(' ');
    try{
        const id = request.body.currentUser;
        const user = await prismaClient.user.findFirst({
            where: {
                id: Number(id)
            }
        });
        if(!user || user.blocked){
            return response.status(401).json({ error: 'User is currently blocked. please contact the support support@app.com' });
        }
        return next();
    }catch(error){
        return response.status(401).json({ error: 'Invalid token' });
    }

}

export { ensureNotBlocked };