import { prismaClient } from "../database/database"
import { sign } from "jsonwebtoken";
class GenerateRefreshToken{
    async execute(userId: number){
        const token = sign({}, process.env.JWT_REFRESH!, { expiresIn: '7d', algorithm: 'HS256', issuer: 'auth', subject: userId.toString() });
        await prismaClient.token.deleteMany({
            where: {
                userId: userId
            }
        })
        await prismaClient.token.create({
            data: {
                token: token,
                userId: userId,
            }
        })
        return token;
    }
}
export { GenerateRefreshToken }