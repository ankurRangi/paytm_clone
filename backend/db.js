const mongoose = requrie('mongoose')

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
    maxLength: 10,
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

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
}
