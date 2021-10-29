'use strict';

const express = require('express');
const morgan = require('morgan');
const surveysDao = require('./dao-surveys');
const answersDao = require('./dao-answers');
const adminDao = require('./dao-admin')
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');

const port = 3001;

passport.use(new passportLocal.Strategy((username, password, done) => {
  adminDao.getUser(username, password).then(user => {
    if (user) {
      done(null, user);
    }
    else {
      done(null, false, { message: 'Username or password wrong' });
    }
  }).catch(err => {
    done(err);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  adminDao.getUserById(id)
    .then(user => {
      done(null, user);
    }).catch(err => {
      done(err, null);
    });
});


const app = express();
app.use(morgan('dev'));
app.use(express.json());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated.' });
};

app.use(session({
  secret: 'this and that and other',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/* Survey API */

/* Admin Request */

app.get('/api/admin/surveys', isLoggedIn, (req, res) => {
  surveysDao.getSurveysByIdAdmin(req.user.id)
    .then(surveys => res.json(surveys))
    .catch(err => res.status(500).json({ error: 'Database error.' }));
})


app.get('/api/admin/surveys/:id', isLoggedIn, (req, res) => {
  surveysDao.getSurveyById(req.params.id, req.user.id)
  .then((survey) => {
    if(survey.error) {
      res.status(404).json(survey);
    }
    else {
      res.json(survey);
    }
  })
  .catch((error) => res.status(500).json({error: 'Database error'}))
})

app.post('/api/admin/surveys', [
  isLoggedIn,   
  check('name').isString(),
  check('questions').isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ erros: errors.array() });
  }
  const survey = {
    name: req.body.name,
    questions: req.body.questions,
  }
  surveysDao.createSurvey(survey, req.user.id)
  .then((lastId) => {
    res.status(201).json({ id: lastId });
  })
  .catch((err) => res.status(503).json({ error: "Database error during the creation of survey." }))
})

app.get('/api/surveys', (req, res) => {
  surveysDao.listSurveys()
    .then(surveys => res.json(surveys))
    .catch(err => res.status(500).json({ error: 'Database error.' }));
})

/* Answers API */

app.post('/api/answers',[
  check('username').isString(),
  check('id_survey').isInt(),
  check('answers').isString(),
  check('tot_answers').isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ erros: errors.array() });
  }
  const answer = {
    username: req.body.username,
    id_survey: req.body.id_survey,
    answers: req.body.answers
  }
  answersDao.fillSurvey(answer)
    .then((lastId) => {
      surveysDao.setTotAnswers(req.body.id_survey, req.body.tot_answers)
          .then((surveyId) =>{
            if(surveyId.error) {
              res.status(404).json(surveyId);
            }
            else {
              res.status(201).json({ id: lastId });
            }
          })
          .catch((error) => res.status(503).json({ error: "Database error during the update of survey."}))
    })
    .catch((err) => res.status(503).json({ error: "Database error to fill out survey." }))
})


app.get('/api/survey/:id/answers', isLoggedIn, (req, res) => {
  answersDao.getFilledAnswersByIdSurvey(req.params.id)
    .then((filledAnswers) => {  
      if (filledAnswers.error) {
        res.status(404).json(filledAnswers);
      }
      else {
        res.json(filledAnswers);
      }
    })
    .catch((error) => res.status(500).json({ error: 'Database error' }))
})


/*** Users APIs ***/

// POST /sessions 
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current 
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});