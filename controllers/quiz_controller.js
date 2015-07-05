var models = require('../models/models');

exports.load = function (req, res, next, quizId) {
    models.Quiz.find(quizId).then(function (quiz) {
        if (quiz) {
            req.quiz = quiz;
            next();
        }
        else {
            next(new Error('No existe quizId=' + quizId));   
        }
    })
    .catch(function (error) {
        next(error);   
    });
};

exports.index = function (req, res) {
    var query = {order: 'pregunta ASC'};
    
    if (req.query.search) {
        var search = '%' + req.query.search + '%';
        search = search.replace(/ /g, '%');
        query.where = ["lower(pregunta) like lower(?)", search];
    }
    
    models.Quiz.findAll(query).then(function (quizes) {
        res.render('quizes/index', {quizes: quizes});
    })
    .catch(function (error) {
        next(error);   
    });
};

exports.show = function (req, res) {
    res.render('quizes/show', {quiz: req.quiz});
};

exports.answer = function (req, res) {
    var resultado = 'Incorrecto';
    
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    }
            
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};