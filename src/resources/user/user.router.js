import { Router } from 'express'
import { UserController } from './user.controllers'
import { ensureAdmin } from '../../middleware/ensure.admin'
const router = Router()

router.route('/createUser').post(UserController.createUser)

// userRouter.use(ensureAdmin)

// router.route('/:id').get(getUser)

export default router
