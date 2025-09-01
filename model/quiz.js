const mongoose = require('mongoose');

// const quizSchema = new mongoose.Schema({
//     question: String,
//     options: [String],
//     numberquestion:Number,
//     quizheading:String,

//     answer: String,
//     level: String,

    // avatar:{
    //     type:String,
    //     required:true
    // }
    // avatar: { type: String, required: true }
// });

// const quizSchema = new mongoose.Schema({
//     category: String,
//     questions: [questionSchema]
// });

const QuizSchema = new mongoose.Schema({
    quizheading: { type: String, required: true },
     avatar: { type: String},
    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        answer: { type: String, required: true },
        level: { type: String, required: true },
      },
    ],
    // category: String,
    numberquestion:Number,
    // level: String,
  });
  const Quiz = mongoose.model('Quiz', QuizSchema);
// const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
