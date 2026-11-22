const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  mood: {
    type: String,
    enum: ['very good', 'great', 'meh', 'mad', 'sad', 'anxious'],
    required: [true, 'Please select your mood today'],
    default: 'unknown'
  },
  score: { type: Number },
  describe: { type: String, default: 'not have' },
  praise: { type: String, default: 'not have' },
  learn: { type: String, default: 'not have' }
});

DataSchema.index({ userId: 1, date: 1 }, { unique: true });

DataSchema.pre('save', function () {
  try {
    switch (this.mood) {
      case 'very good': this.score = 5; break;
      case 'great':     this.score = 4; break;
      case 'meh':       this.score = 3; break;
      case 'mad':       this.score = 2; break;
      case 'sad':       this.score = 1; break;
      case 'anxious':   this.score = 1; break;
      default:          this.score = 0;
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model('Note', DataSchema);