const express = require('express')
const zod = require('zod')


const router = express.Router()
exports.router = router

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string(),
})
exports.signupSchema = signupSchema

module.exports = router
