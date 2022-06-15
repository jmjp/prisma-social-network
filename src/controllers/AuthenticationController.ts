import { Prisma } from '@prisma/client';
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { prismaClient } from '../database/database';
import { AuthenticationUseCase } from '../useCases/AuthenticationUseCase';
class AuthenticationController{
    async register(req: Request, res: Response){
        const { username, email, password, avatar } = req.body;
        try{
            const authenticationUseCase = new AuthenticationUseCase();
            const user =  await authenticationUseCase.register({ username, email, password, avatar });
            return res.json({status: "success", data: user });   
        }catch(error: any){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                return res.status(400).json({status: "error", message: error.code});
            }
            return res.status(400).json({status: "error", message: error.message});
        }
    }
    async login(req: Request, res: Response){
       const { username, password } = req.body;
        try{
            const authenticationUseCase = new AuthenticationUseCase();
            const auth =  await authenticationUseCase.login({ username, password });
            return res.json({status: "success", data: auth });
        }catch(error: any){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                return res.status(400).json({status: "error", message: error.code});
            }
            return res.status(400).json({status: "error", message: error.message});
        }
    }
    async refreshToken(req: Request, res: Response){
        const { refresh_token } = req.body;
        try{
            const authenticationUseCase = new AuthenticationUseCase();
            const auth =  await authenticationUseCase.refreshToken(refresh_token);
            return res.json({status: "success", token: auth.token, refresh_token: auth.refresh});
        }catch(error: any){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                return res.status(400).json({status: "error", message: error.code});
            }
            return res.status(400).json({status: "error", message: error.message});
        }
    }   
}

export { AuthenticationController }