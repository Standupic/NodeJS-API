import { Router } from 'express'
import { Product } from './product.model'
import { crudControllers } from '../../utils/crud'

const router = Router()

router.route('/create').post(crudControllers(Product).createOne)

router.route(':id').get(crudControllers(Product).getOne)

export default router
