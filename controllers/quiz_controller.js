var models = require('../models/models');

exports.index = function (req, res) {
    models.Quiz.findAll().then(function (quizes) {
        res.render('quizes/index', {quizes: quizes});
    });
};

exports.show = function (req, res) {
    models.Quiz.find(req.params.quizId).then(function (quiz) {
        res.render('quizes/show', {quiz: quiz});
    });
};

exports.answer = function (req, res) {
    models.Quiz.find(req.params.quizId).then(function (quiz) {
        if (req.query.respuesta === quiz.respuesta) {
            res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
        }
        else {
            res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});
        }
    });
};