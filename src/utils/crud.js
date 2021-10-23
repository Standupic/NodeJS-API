import { autoCatch } from '../utils/autoCatch'

export const getOne = model => async (req, res) => {
  const id = req.params.id
  const userId = req.query.createdBy
  const doc = await model.findOne({ _id: id, createdBy: userId })
  res.status(200).json({ data: doc })
}

export const getMany = model => async (req, res) => {
  const doc = await model.find({ createdBy: req.query.createdBy })
  res.status(200).json({ data: doc })
}

export const createOne = model => async (req, res) => {
  const doc = await model.create({ ...req.body, createdBy: req.body.createdBy })
  res.status(200).json({ data: doc })
}

export const updateOne = model => async (req, res) => {
  const doc = await model.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.query.createdBy
    },
    req.body,
    { new: true }
  )
  res.status(200).json({ data: doc })
}

export const removeOne = model => async (req, res) => {
  const doc = await model
    .findOneAndRemove({
      _id: req.params.id,
      createdBy: req.query.createdBy
    })
    .exec()
  res.status(200).json({ data: doc })
}

export const crudControllers = model =>
  autoCatch({
    removeOne: removeOne(model),
    updateOne: updateOne(model),
    getMany: getMany(model),
    getOne: getOne(model),
    createOne: createOne(model)
  })
