import { Router } from 'express';
import { AuthenticationController } from './controllers/AuthenticationController';
import { PostController } from './controllers/PostController';
import { UserController } from './controllers/UserController';
import { ensureAuthenticated } from './middlewares/EnsureAuthenticatited';
import { ensureNotBlocked } from './middlewares/EnsureNotBlocked';

const routes = Router();
const public_routes = Router();

const userController = new UserController();
const postController = new PostController();
const authController = new AuthenticationController();

routes.use(ensureAuthenticated);
routes.use(ensureNotBlocked);

routes.get('/users', userController.find);
routes.get('/users/me', userController.me);
routes.get('/users/feed', userController.feed);
routes.get('/users/:id', userController.findOne);
routes.post('/users/follow/:id', userController.follow);
routes.post('/users/unfollow/:id', userController.unfollow);

routes.get('/posts', postController.find);
routes.get('/posts/:id', postController.findOne);
routes.delete('/posts/:id', postController.delete);
routes.post('/posts', postController.create);
routes.put('/posts/:id', postController.update);
routes.post('/comments/post/:id', postController.comment);
routes.post('/refresh-token', authController.refreshToken);

//auth routes
public_routes.post('/login', authController.login);
public_routes.post('/register', authController.register);


export { routes, public_routes };