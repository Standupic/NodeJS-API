import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { UserModel } from '../resources/user/user.model'
import bcrypt from 'bcryptjs'

const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus'
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }

passport.use(adminStrategy())

const authenticate = passport.authenticate('local', { session: false })

const login = async (req, res, next) => {
  const token = await sign({ username: req.user.username })
  res.cookie('jwt', token, { httpOnly: true })
  res.json({ success: true, token: token })
}

const ensureUser = async (req, res, next) => {
  const jwtString = req.headers.authorization || req.cookies.jwt
  const payload = await verify(jwtString)
  if (payload.username === 'admin') {
    if (req.user.username === 'admin') req.isAdmin = true
    return next()
  }
  const err = new Error('Unauthorized')
  err.statusCode = 401
  next(err)
}

async function sign(payload) {
  return jwt.sign(payload, jwtSecret, jwtOpts)
}

async function verify(jwtString = '') {
  jwtString = jwtString.replace(/^Bearer /i, '')
  try {
    return await jwt.verify(jwtString, jwtSecret)
  } catch (err) {
    err.statusCode = 401
    throw err
  }
}

function adminStrategy() {
  return new Strategy(async function(username, password, cb) {
    const isAdmin = username === 'admin' && password === adminPassword
    if (isAdmin) return cb(null, { username: 'admin' })
    try {
      const user = await UserModel.get(username)
      const isUser = await bcrypt.compare(password, user.password)
      if (isUser) return cb(null, { username: user.username })
    } catch (e) {
      cb(null, false)
    }
  })
}

module.exports = {
  ensureUser,
  authenticate,
  login
}
