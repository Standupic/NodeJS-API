import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { isUnique } from '../../utils/user'
import cuid from 'cuid'
import { isEmail, isAlphanumeric } from 'validator'

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

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: cuid },
    password: { type: String, maxLength: 120, required: true },
    email: emailSchema({ required: true }),
    username: userNameSchema()
  },
  { timestamps: true }
)

/* userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err)
    }

    this.password = hash
    next()
  })
})

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }

      resolve(same)
    })
  })
} */

export const User = mongoose.model('user', userSchema)
