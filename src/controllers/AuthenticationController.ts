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
            return res.json({ message: user });   
        }catch(error: any){
            return res.status(400).json({status: "error", message: error.message});
        }
    }
    async login(req: Request, res: Response){
       const { username, password } = req.body;
        try{
            const authenticationUseCase = new AuthenticationUseCase();
            const auth =  await authenticationUseCase.login({ username, password });
            return res.json(auth);
        }catch(error: any){
            return res.status(400).json({status: "error", message: error.message});
        }
    }
    async refreshToken(req: Request, res: Response){
        const { refresh_token } = req.body;
        try{
            const authenticationUseCase = new AuthenticationUseCase();
            const auth =  await authenticationUseCase.refreshToken(refresh_token);
            return res.json({token: auth.token, refresh_token: auth.refresh});
        }catch(error: any){
            return res.status(400).json({status: "error", message: error.message});
        }
    }   
}

export { AuthenticationController }