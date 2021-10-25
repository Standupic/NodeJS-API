import { User } from '../resources/user/user.model'

export const getOne = async username => {
  return User.findOne({ username })
}

export const isUnique = async (doc, username) => {
  const existing = await getOne(username)
  return !existing || doc._id === existing._id
}
