var express = require('express');
var router = express.Router();

var authorController = require('../controllers/author_controller');
var quizController = require('../controllers/quiz_controller');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

router.get('/author', authorController.credits);

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
