import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy } from 'passport-local'
import autoCatch from './autoCatch'

const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus'
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }

// passport.use(adminStrategy())

export const authenticate = passport.authenticate('local', { session: false })

export const login = async (req, res, next) => {
  const token = await sign({ username: req.user.username })
  res.cookie('jwt', token, { httpOnly: true })
  res.json({ success: true, token: token })
}

async function ensureAdmin(req, res, next) {
  const jwtString = req.headers.authorization || req.cookies.jwt
  const payload = await verify(jwtString)
  if (payload.username === 'admin') return next()
  const err = new Error('Unauthorized')
  err.statusCode = 401
  next(err)
}

async function sign(payload) {
  console.log(payload, 'payload')
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
  return new Strategy(function(username, password, cb) {
    const isAdmin = username === 'admin' && password === adminPassword
    if (isAdmin) return cb(null, { username: 'admin' })
    cb(null, false)
  })
}
