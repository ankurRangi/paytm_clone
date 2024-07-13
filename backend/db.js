const mongoose = require('mongoose')

mongoose.connect(
    'mongodb+srv://ankurRangi:cAkXj9tKE68NPYmx@paytmdb.mhgcl65.mongodb.net/'
)

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 4,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 50,
    },
})

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    require: true
  },
  balance: {
    type: Number,
    require: true
  }
})

const User = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User,
    Account
}
