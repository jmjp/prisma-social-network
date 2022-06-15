import { sign } from "jsonwebtoken";
class GenerateAccessToken {
    async execute(userId: string) {
        const token = sign({}, process.env.JWT_ACCESS!, { expiresIn: '1h', algorithm: 'HS256', issuer: 'auth', subject: userId });
        return token;
    }
}
export { GenerateAccessToken }