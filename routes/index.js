var express = require('express');
var app = express.Router();
const Quizs=require("../model/quiz")

app.get('/', async (req, res, next) => {
  try {
    
    const quizzes = await Quizs.find();

    console.log('Quizzes:', quizzes); 
   
    res.render('index', { Quizs: quizzes });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).send('Error fetching quizzes'); 
  }
});



module.exports = app;
