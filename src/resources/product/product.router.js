import { Router } from 'express'
import { Product } from './product.model'
import { crudControllers } from '../../utils/crud'

const router = Router()

router.route('/create').post(crudControllers(Product).createOne)

router.route('/:id').get(crudControllers(Product).getOne)

router.route('/getMany').get(crudControllers(Product).getMany)

router.route('/:id/updateOne').patch(crudControllers(Product).updateOne)

router.route('/:id').delete(crudControllers(Product).removeOne)

export default router
