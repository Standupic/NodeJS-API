import { autoCatch } from '../utils/autoCatch'

export const getOne = model => async (req, res, next) => {
  const id = req.params.id
  const userId = req.query.createdBy
  const doc = await model.findOne({ _id: id, createdBy: userId })
  if (!doc) {
    return next()
  }
  res.status(200).json({ data: doc })
}

export const getManyCreatedBy = model => async (req, res, next) => {
  const doc = await model.find({ createdBy: req.query.createdBy })
  if (!doc) {
    return next()
  }
  res.status(200).json({ data: doc })
}

export const getMany = model => async (req, res, next) => {
  const doc = await model.find()
  if (!doc) {
    return next()
  }
  res.status(200).json({ data: doc })
}

export const createOne = model => async (req, res, next) => {
  const doc = await model.create({ ...req.body, createdBy: req.body.createdBy })
  if (!doc) {
    return next()
  }
  res.status(200).json({ data: doc })
}

export const updateOne = model => async (req, res, next) => {
  const doc = await model.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.query.createdBy
    },
    req.body,
    { new: true }
  )
  if (!doc) {
    return next()
  }
  res.status(200).json({ data: doc })
}

export const removeOne = model => async (req, res, next) => {
  const doc = await model
    .findOneAndRemove({
      _id: req.params.id,
      createdBy: req.query.createdBy
    })
    .exec()
  if (!doc) {
    return next()
  }
  res.status(200).json({ data: doc })
}

export const crudControllers = model =>
  autoCatch({
    removeOne: removeOne(model),
    updateOne: updateOne(model),
    getManyCreatedBy: getManyCreatedBy(model),
    getOne: getOne(model),
    createOne: createOne(model),
    getMany: getMany(model)
  })
