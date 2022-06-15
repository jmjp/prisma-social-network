import { Request, Response } from 'express';
import { prismaClient } from "../database/database";

class PostController {
    async find(req: Request, res: Response) {
        const page = req.query.page != undefined ? Number(req.query.page) : 1;
        try {
            const posts = await prismaClient.post.findMany({
                where: {
                    postId: null
                },
                take: 10,
                skip: 10 * (page - 1),
                orderBy: {
                    createdAt: "desc"
                }
            });
            return res.json(posts);
        } catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async findOne(req: Request, res: Response) {
        try {
            const posts = await prismaClient.post.findMany({
                where: {
                    id: Number(req.params.id)
                },
                include: {
                    author: true,
                    tags: true,
                    media: true,
                    comments: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatar: true
                                }
                            }
                        },
                        take: 5,
                        orderBy: {
                            createdAt: "desc"
                        }
                    },

                }
            });
            return res.json(posts);
        } catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async create(req: Request, res: Response) {
        try {
            const { content, currentUser, tags, media } = req.body;
            const post = await prismaClient.post.create({
                data: {
                    content,
                    author: {
                        connect: {
                            id: Number(currentUser)
                        }
                    },
                    tags: {
                        connectOrCreate: tags.map((tag: any) => ({
                            where: {
                                name: tag
                            },
                            create: {
                                name: tag
                            }

                        }))
                    },
                    media: {
                        createMany: {
                            data: media.map((media: any) => (
                                {
                                    url: media.url
                                }
                            ))
                        }
                    }
                }
            });
            return res.json(post);
        } catch (error: any) {
            console.log(error);
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const post = await prismaClient.post.delete({
                where: {
                    id: Number(req.params.id)
                }
            });
            return res.json(post);
        } catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async comment(req: Request, res: Response) {
        const { content, currentUser, tags, media } = req.body;
        try {
            const post = await prismaClient.post.create({
                data: {
                    content: content,
                    post: {
                        connect: {
                            id: Number(req.params.id)
                        }
                    },
                    author: {
                        connect: {
                            id: Number(currentUser)
                        }
                    },
                    tags: {
                        connectOrCreate: tags.map((tag: any) => ({
                            where: {
                                name: tag
                            },
                            create: {
                                name: tag
                            }

                        }))
                    },
                    media: {
                        createMany: {
                            data: media.map((media: any) => (
                                {
                                    url: media.url
                                }
                            ))
                        }
                    }
                    
                }
            })
            return res.json(post);
        }
        catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
    async update(req: Request, res: Response) {
        const { content, tags } = req.body;
        try {
            const post = await prismaClient.post.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    content,
                    
                }
            })
            return res.json(post);
        } catch (error: any) {
            return res.status(400).json({ status: "error", message: error.message });
        }
    }
}


export { PostController }   