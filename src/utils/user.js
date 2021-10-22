import { User } from '../resources/user/user.model'

export const getOne = async username => {
  const user = await User.findOne({ username })
  return user
}

export const isUnique = async (doc, username) => {
  const existing = await getOne(username)
  return !existing || doc._id === existing._id
}
