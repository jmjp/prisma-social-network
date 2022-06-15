import { Router } from 'express';
import { AuthenticationController } from './controllers/AuthenticationController';
import { PostController } from './controllers/PostController';
import { UserController } from './controllers/UserController';
import { ensureAuthenticated } from './middlewares/EnsureAuthenticatited';

const routes = Router();

const userController = new UserController();
const postController = new PostController();
const authController =  new AuthenticationController();

routes.get('/users', ensureAuthenticated ,userController.find);
routes.get('/users/me', ensureAuthenticated ,userController.me);
routes.get('/users/feed', ensureAuthenticated ,userController.feed);
routes.get('/users/:id', ensureAuthenticated, userController.findOne);
routes.post('/users/follow/:id', ensureAuthenticated, userController.follow);
routes.post('/users/unfollow/:id', ensureAuthenticated, userController.unfollow);

routes.get('/posts', ensureAuthenticated , postController.find);
routes.get('/posts/:id', ensureAuthenticated , postController.findOne);
routes.delete('/posts/:id', ensureAuthenticated , postController.delete);
routes.post('/posts', ensureAuthenticated , postController.create);
routes.put('/posts/:id', ensureAuthenticated , postController.update);
routes.post('/comments/post/:id', ensureAuthenticated , postController.comment);

routes.post('/auth/login', authController.login);
routes.post('/auth/register', authController.register);
routes.post('/auth/refresh-token', authController.refreshToken);


export { routes };