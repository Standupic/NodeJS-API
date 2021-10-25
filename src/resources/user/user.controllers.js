import { User, UserModel } from './user.model'
import http from 'http'

const createUser = async (req, res) => {
  try {
    const user = await UserModel.create(req.body)
    const { username, email, _id } = user
    res.json({ username, email, _id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const getUser = async (req, res, next) => {
  const user = await UserModel.findOne({ _id: req.params.id }).exec()
  if (!user) {
    return res.status(400).json({ error: http.STATUS_CODES[400] })
  }
  res.status(200).json({ data: user })
}

export const me = (req, res) => {
  console.log(req.query)
  res.status(200).json({ data: 'hello' })
}

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const UserController = {
  createUser
}
