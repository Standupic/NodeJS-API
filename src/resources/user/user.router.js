import { Router } from 'express'
import { me, updateMe, createUser, getUser } from './user.controllers'

const userRouter = Router()

userRouter.
    route("/:id")
    .get(getUser)

userRouter
    .route('/')
    .get(me)

export default userRouter
