const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'write your name please'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'write your phonenumber please'],
    trim: true,
    unique: true,
    validate: {
      validator: function (v) {
        const isPhone = /^[0-9]{10}$/.test(v);
        const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        return isPhone || isEmail;
      },
      message: "please try again isn't valid"
    }
  },
  password: {
    type: String,
    required: [true, 'write your password please'],
    trim: true,
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, 'your password too weak please try again'],
    select: false
  },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);