import { Router } from 'express'
import { me, updateMe, createUser, getUser } from './user.controllers'
import { ensureAdmin } from '../../middleware/ensure.admin';
const userRouter = Router()

userRouter
    .route('/createUser')
    .post(createUser)

// userRouter.use(ensureAdmin)

userRouter.
    route("/:id")
    .get(getUser)


export default userRouter
