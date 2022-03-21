import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
const router = new Router();

router.route('/').get(UserController.getUsers);

router.route('/getUsersWithEntryCount').get(UserController.getUsersWithEntryCount);

router.route('/:user_id').get(UserController.getUser);

//router.route('/').post(UserController.addUser);

router.route('/:user_id').put(UserController.updateUser);

router.route('/:user_id').delete(UserController.deleteUser);

export default router;
