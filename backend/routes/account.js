const express = require('express')
const zod = require('zod')

const { User, Account } = require('../db')
const { authMiddleware } = require('../middleware')
const { default: mongoose } = require('mongoose')

const router = express.Router()

router.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId,
    })

    res.status(200).json({
        balance: account.balance,
    })
})

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = mongoose.startSession()

    session.startTransaction()
    const { amount, to } = req.body

    //Fetch the account within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
        session
    )

    if (!account || account.balance < amount) {
        ;(await session).abortTransaction()
        res.status(403).json({
            message: 'Insufficient Balance',
        })
    }

    const toAccount = await Account.findOne({ userId: to }).session(session)

    if (!toAccount) {
        ;(await session).abortTransaction()
        res.status(403).json({
            message: 'Invalid Account',
        })
    }

    await Account.updateOne(
        { userId: req.userId },
        { $inc: { balance: -amount } }
    ).session(session)
    await Account.updateOne(
        { userId: to },
        { $inc: { balance: amount } }
    ).session(session)

    // Commit the transaction
    (await session).commitTransaction()
    res.json({
        message: "Transfer Successfull"
    })
})
