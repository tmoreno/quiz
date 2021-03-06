var models = require('../models/models');

var temas = [{
                id: 'otro', 
                value: 'Otro'
             },
             {
                id: 'humanidades', 
                value: 'Humanidades'
             },
             {
                id: 'ocio', 
                value: 'Ocio'
             },
             {
                id: 'ciencia', 
                value: 'Ciencia'
             },
             {
                id: 'tecnologia', 
                value: 'Tecnología'
             }];

exports.load = function (req, res, next, quizId) {
    models.Quiz.find({
        where: {id: Number(quizId)},
        include: [{model: models.Comment}]
    })
    .then(function (quiz) {
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
        res.render('quizes/index', {quizes: quizes, errors: []});
    })
    .catch(function (error) {
        next(error);   
    });
};

exports.show = function (req, res) {
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

exports.answer = function (req, res) {
    var resultado = 'Incorrecto';
    
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    }
            
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.new = function (req, res) {
    var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta", tema: "otro"});
    
    res.render('quizes/new', {quiz: quiz, temas: temas, errors: []});
};

exports.create = function (req, res) {
    var quiz = models.Quiz.build(req.body.quiz);
    
    quiz.validate().then(function (error) {
        if (error) {
            res.render('quizes/new', {quiz: quiz, temas: temas, errors: error.errors});
        }
        else {
            quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function () {
                res.redirect('/quizes');
            });
        }
    });
};

exports.edit = function (req, res) {
    var quiz = req.quiz;
    
    res.render('quizes/edit', {quiz: quiz, temas: temas, errors: []});
};

exports.update = function (req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    
    req.quiz.validate().then(function (error) {
        if (error) {
            res.render('quizes/edit', {quiz: req.quiz, errors: error.errors});
        }
        else {
            req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function () {
                res.redirect('/quizes');
            });
        }
    });
};

exports.destroy = function (req, res) {
    req.quiz.destroy().then(function () {
        res.redirect('/quizes');
    })
    .catch(function (error) {
        next(error);   
    });
};