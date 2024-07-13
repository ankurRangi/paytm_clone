const express = require('express')
const zod = require('zod')
const jwt = require('jsonwebtoken')

const JWT_SECRET = require('../config')
const { User, Account } = require('../db')
const { authMiddleware } = require('../middleware')

const router = express.Router()

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string(),
})

const updateSchema = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
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

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({ userId }, JWT_SECRET)

    res.json({
        message: 'User created successfully',
        token: token,
    })
})

router.put('/', authMiddleware, async (req, res) => {
    const body = req.body
    const { success } = updateSchema.safeparse(body)

    if (success) {
        res.status(403).json({ message: 'Invalid Inputs' })
    }
    await User.updateOne(req.body, { id: req.userId })

    res.status(200).json({message: "Data Updated Successfully"})
})

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || ""

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router
