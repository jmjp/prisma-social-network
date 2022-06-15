import { prismaClient } from "../database/database";
import argon2 from 'argon2';
import { verify } from 'jsonwebtoken';
import { user } from "@prisma/client";
import { GenerateRefreshToken } from "../provider/GenerateRefreshToken";
import { GenerateAccessToken } from "../provider/GenerateAccessToken";

interface IUserCreateRequest {
    username: string, email: string, password: string, avatar?: string
}

interface IUserLoginRequest {
    username: string, password: string
}
class AuthenticationUseCase {
    async register(request: IUserCreateRequest): Promise<user | Error> {
        const exists = await prismaClient.user.findFirst({
            where: {
                OR: [
                    { username: request.username },
                    { email: request.email },
                ]
            }
        });
        if(exists) {
            throw new Error('User with username or email already exists');
        }
        const hashPassword = await argon2.hash(request.password);
        const user = await prismaClient.user.create({
            data: {
                username: request.username,
                email: request.email,
                password: hashPassword,
                avatar: request.avatar
            }
        })
        return user;
    }
    async login(request: IUserLoginRequest): Promise<{ user: user; token: string; refresh: string } | Error> {
        const user = await prismaClient.user.findFirst({
            where: {
                username: request.username,
            }
        })
        if (!user) {
            throw new Error('User not found or invalid password');
        }
        const passwordMatch = await argon2.verify(user.password!, request.password);
        if (!passwordMatch) {
            throw new Error('User not found or invalid password');
        }
        const token = await new GenerateAccessToken().execute(user.id.toString());
        const refresh = await new GenerateRefreshToken().execute(user.id);
        return { user, token, refresh };
    }
    async refreshToken(refresh_token: string) {
        const refreshToken = await prismaClient.token.findFirst({
            where:{
                token: refresh_token
            }
        })
        if(!refreshToken) {
            throw new Error('Invalid refresh token');
        }
        try{
            await verify(refreshToken.token, process.env.JWT_REFRESH!);
            const token = await new GenerateAccessToken().execute(refreshToken.userId.toString());
            const refresh = await new GenerateRefreshToken().execute(refreshToken.userId);
            return { token, refresh };
        }catch(error){
            throw new Error('Refresh token expires');
        }
    }
}

export { AuthenticationUseCase }