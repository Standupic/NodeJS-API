import autoCatch from '../utils/autoCatch'

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
      createdBy: req.user._id
    },
    req.body,
    { new: true }
  )
  if (!doc) {
    return res.status(400).end()
  }
  res.status(200).json({ data: doc })
}

export const removeOne = model => async (req, res) => {
  const doc = await model
    .findOneAndRemove({
      _id: req.params.id,
      createdBy: req.user._id
    })
    .exec()
  if (!doc) {
    return res.status(400).end()
  }
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
