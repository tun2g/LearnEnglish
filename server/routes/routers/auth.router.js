const router = require("express").Router()
const AuthController = require('../../controllers/auth.c')

const jwtMiddleware = require('../../middlewares/jwt.m')

router.post('/register',AuthController.register)
router.post('/login',AuthController.login)
router.post('/refresh',AuthController.requestRefreshToken)

router.post('/check',jwtMiddleware.authenticateToken,AuthController.check)

module.exports = router