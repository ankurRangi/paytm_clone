const express = require('express')
const zod = require('zod')
const jwt = require('jsonwebtoken')

const JWT_SECRET = require('../config')
const { User } = require('../db')

const router = express.Router()

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string(),
})

// Signup API
router.post('/signup', async (req, res) => {
    const body = req.body
    const { success } = signupSchema.safeparse(body)

    if (!success) {
        res.status(411).json({
            message: 'Incorrect inputs',
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username,
    })

    if (existingUser) {
        res.status(411).json({
            message: 'Email already exists',
        })
    }

    //Generally send an email verification.

    const dbUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    const userId = dbUser._id

    const token = jwt.sign({ userId }, JWT_SECRET)

    res.json({
        message: 'User created successfully',
        token: token,
    })
})

module.exports = router
