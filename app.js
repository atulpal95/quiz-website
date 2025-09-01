if(process.env.NODE_ENV !="production"){
  require('dotenv').config();}
var createError = require('http-errors');
var express = require('express');
const app=express()
var path = require('path');
const ejsMate=require("ejs-mate")
const mongoose =require("mongoose")
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport=require("passport");
const LocalStrategy= require("passport-local").Strategy;
const User=require("./model/user.js")
const Result=require("./model/result.js")
const  Quiz=require("./model/quiz.js")
const puppeteer = require('puppeteer')
const {isLoggedIn}=require("./middleware.js")
const {saveRedirecrUrl}=require("./middleware.js")


app.use('/uploads', express.static('uploads'));

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
})
var upload = multer({ storage: storage });


app.use(express.json());

(async () => {
  try {
    const browser = await puppeteer.launch(); 
    const page = await browser.newPage(); 

    
    await page.setContent('<h1>Hello, PDF!</h1>');
    await page.pdf({ path: 'example.pdf', format: 'A4' });

    console.log('PDF Generated Successfully');
    await browser.close(); 
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
})();



var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


engine = require('ejs-mate'),
 
app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); 


app.engine("ejs",ejsMate)
 app.set("view engine","ejs");
 app.set("views",path.join(__dirname,"views"))
 app.use(express.urlencoded({extended:true}))
 app.use (express.static( path.join(__dirname,"/public")))
 

 app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use('/', indexRouter);
app.use('/users', usersRouter);


main()
 .then(()=>{
    console.log("conecctd to dbs");
 })
 .catch((err)=>{
    console.log(err);
 });
 async function main (){
   await  mongoose.connect('mongodb://127.0.0.1:27017/nayakQuiz');
   
  }


  app.get("/signup",(req,res)=>{
    res.render("./user/register.ejs")
  })
  app.get("/login",(req,res)=>{
    res.render("./user/login.ejs")
  })

 

  app.post("/signup", async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      
      const newUser = new User({ email, username });
  
      
      const registeredUser = await User.register(newUser, password);
  
      console.log("User registered:", registeredUser);
  
     
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err); 
        }
       
        
      return res.status(400).redirect("/");
      });
    } catch (e) {
      console.error("Error during signup:", e.message);
  
      
      return res.status(400).redirect("/");
    }
  });
  

  app.post('/login',saveRedirecrUrl, 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      let redirectUrl =res.locals.redirectUrl|| "/"
      res.redirect(redirectUrl);

    });

    app.get("/start95",(req,res)=>{
      res.render("./user/headQuiz.ejs")
    })



    

app.post('/submit-quiz',upload.single("avatar"), async (req, res) => {
  // if (!req.file) {
  //   return res.status(400).send('Error: Avatar file is missing');

 
  const { quizheading, numberquestion, questions ,avatar} = req.body;

  // Check if data is present
  console.log('Received quiz data:', {
    quizheading,
    numberquestion,
    questions,
    avatar,
  });

  if (quizheading && numberquestion && questions) {
    try {
    



      const newQuiz = new Quiz({
        quizheading,
        numberquestion,
        questions, // Ensure this is parsed if it's a JSON string
        avatar // Save the file path
    });
    
      // Save the quiz to the database
      await newQuiz.save();

    
      console.log("Quiz submitted successfully!")
      // res.redirect("/index.ejs")
      const quizzes = await Quiz.find();
      res.render('index', { Quizs: quizzes });
    } catch (error) {
      console.error('Error saving quiz:', error);
      res.status(500).send('Error saving quiz to the database');
    }
  } else {
    res.status(400).send('Error: Missing data');
  }
});




app.get('/take-quiz/:quizId',isLoggedIn,async(req, res) => {
  const quizId = req.params.quizId;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    res.render('./user/quizform.ejs', { quiz });
  } catch (error) {
    res.status(500).send('Error loading quiz');
  }
});



app.post('/submit-quiz/:quizId', async (req, res) => {
  console.log("Quiz submission initiated");

  const quizId = req.params.quizId;
  const userAnswers = req.body.answers; // Capture user answers
  // const result =req.body

  try {
    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).send('Invalid Quiz ID');
    }

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    console.log("the  length"+quiz.questions.length)
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    console.log("Quiz submission ");
    // Validate answers
    if (!Array.isArray(userAnswers) || userAnswers.length !== quiz.questions.length) {
      return res.status(400).send('Invalid answers submitted');
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (userAnswers[index] && userAnswers[index] === question.answer) {
        score += 5; // Each question is worth 5 marks
      }
    });
console.log(score)
    // Total marks
    const totalMarks = quiz.questions.length * 5;

    // Optionally save results
    const result = new Result({
      userId: req.user._id, 
      quizId,
      score,
      totalMarks,
      date: new Date(),
    });
    console.log(result);
  const pre= req.user
    await result.save();

    // Render the result
    console.log(pre.username)
    
    res.render('./user/quizResult.ejs', { score, totalMarks, quiz ,User,pre});
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).send('An unexpected error occurred. Please try again later.');
  }
});

app.get("/contact",(req,res)=>{
  res.render("./user/contact.ejs")
})


// })
app.get("/user/profile",isLoggedIn,async (req, res) => {
  const user = await User.findById(req.user._id); 
  const results = await Result.find({ userId: req.user._id }).populate('quizId');
  res.render("./user/profile.ejs", { user, results });
});


app.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); 
      res.redirect('/login'); 
    });
  });
});
module.exports = app;
