import { Router } from 'express'
import { me, updateMe, createUser, getUser } from './user.controllers'
import { ensureAdmin } from '../../middleware/ensure.admin'
const router = Router()

router.route('/createUser').post(createUser)

// userRouter.use(ensureAdmin)

router.route('/:id').get(getUser)

export default router
