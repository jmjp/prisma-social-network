import { Request, Response } from 'express';
import { prismaClient } from '../database/database';
class UserController {
    async find(req: Request, res: Response) {
        const page = req.query.page != undefined ? Number(req.query.page) : 1;
        try {
            const users = await prismaClient.user.findMany({
                take: 10,
                skip: 10 * (page - 1),
            });
            return res.json(users);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
    async findOne(req: Request, res: Response) {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    id: Number(req.params.id)
                },
                include: {
                    posts: true,
                    followedBy: true,
                    following: true,
                }
            });
            return res.json(user);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
    async follow(req: Request, res: Response) {
        const { content, currentUser, tags } = req.body;
        try {
            const post = await prismaClient.user.update({
                where: {
                    id: Number(currentUser)
                },
                data: {
                    following: {
                        connect: {
                            id: Number(req.params.id)
                        }
                    }
                }
            })
            return res.json(post);
        } catch (error) {
            return res.status(400).json(error); 
        }
    }
    async unfollow(req: Request, res: Response) {
        const { content, currentUser, tags } = req.body;
        try {
            const post = await prismaClient.user.update({
                where: {
                    id: Number(currentUser)
                },
                data: {
                    following: {
                        disconnect: {
                            id: Number(req.params.id)
                        }
                    }
                }
            })
            return res.json(post);
        } catch (error) {
            return res.status(400).json(error); 
        }
    }
    async me(req: Request, res: Response){
        const currentUser = req.body.currentUser;
        try{
            const user = await prismaClient.user.findUnique({
                where: {
                    id: Number(currentUser)
                },
                include: {
                    posts: {
                        take: 5
                    },
                    _count:{
                        select: {
                            followedBy: true,
                            following: true,
                        }
                    }
                }
            })
            return res.json(user);
        }catch(error){
            return res.status(400).json(error);
        }
    }
    async feed(req: Request, res: Response){
        const currentUser = req.body.currentUser;
        const page = req.query.page != undefined ? Number(req.query.page) : 1;
        try{
            const user = await prismaClient.post.findMany({
                where: {
                    author: {
                        followedBy: {
                            some: {
                                id: Number(currentUser)
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 10,
                skip: 10 * (page - 1),
            })
            return res.json(user);
        }catch(error){
            return res.status(400).json(error);
        }
    }

}

export { UserController }