import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ error: 'No token provided' });
    }
    const [prefix,token] =  authHeader.split(' ');
    try{
        var decoded = verify(token, process.env.JWT_ACCESS!);
        request.body.currentUser = decoded["sub"];
        return next();
    }catch(error){
        return response.status(401).json({ error: 'Invalid token' });
    }

}

export { ensureAuthenticated };