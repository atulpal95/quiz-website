const mongoose = require('mongoose');

// const resultSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to the User model
//     // required: true,
//   },
//   quizId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Quiz', // Reference to the Quiz model
//     required: true,
//   },
//   score: {
//     type: Number,
//     required: true,
//   },
//   totalMarks: {
//     type: Number,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Result = mongoose.model('Result', resultSchema);

// module.exports = Result;

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', // Reference to the Quiz model
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  timeTaken: {
    type: Number, // Time in seconds
    default: null,
  },
});

// Virtual field for percentage score
resultSchema.virtual('percentage').get(function () {
  return ((this.score / this.totalMarks) * 100).toFixed(2);
});

// Index for faster lookups
resultSchema.index({ userId: 1, quizId: 1 });

module.exports = mongoose.model('Result', resultSchema);
