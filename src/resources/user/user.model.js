import mongoose from 'mongoose'
import { isUnique } from '../../utils/user'
import cuid from 'cuid'
import { isAlphanumeric, isEmail } from 'validator'
import bcrypt from 'bcryptjs'
import { autoCatch } from '../../utils/autoCatch'

const SALT_ROUNDS = 10

const emailSchema = (opts = {}) => {
  const { required } = opts
  return {
    type: String,
    required: !!required,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email address`
    }
  }
}

const userNameSchema = () => {
  return {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 3,
    maxLength: 16,
    validate: [
      {
        validator: isAlphanumeric,
        message: props => `${props.value} contains special characters`
      },
      {
        validator: str => !str.match(/^admin$/i),
        message: props => 'invalid username'
      },
      {
        validator: function(username) {
          return isUnique(this, username)
        },
        message: props => 'Username is taken'
      }
    ]
  }
}

export const get = async username => {
  return User.findOne({ username })
}

export const edit = async (username, change) => {
  const user = await get(username)
  Object.keys(change).forEach(key => {
    user[key] = change[key]
  })
  if (change.password) await hashPassword(user)
  await user.save()
  return user
}

export const create = async fields => {
  const user = new User(fields)
  await hashPassword(user)
  await user.save()
  return user
}

const hashPassword = async user => {
  if (!user.password) throw user.invalidate('password', 'password is required')
  if (user.password.length < 12)
    throw user.invalidate('password', 'password must be at least 12 characters')
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
}

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: cuid },
    password: { type: String, maxLength: 120, required: true },
    email: emailSchema({ required: true }),
    username: userNameSchema()
  },
  { timestamps: true }
)

export const User = mongoose.model('user', userSchema)

export const UserModel = autoCatch({
  get,
  edit,
  create,
  model: User
})
