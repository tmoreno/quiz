var models = require('../models/models');

exports.new = function (req, res) {    
    res.render('comments/new', {quizId: req.params.quizId, errors: []});
};

exports.create = function (req, res, next) {
    var comment = models.Comment.build({texto: req.body.comment.texto, QuizId: req.params.quizId});
    
    comment.validate().then(function (error) {
        if (error) {
            res.render('comments/new', {comment: comment, quizId: req.params.quizId, errors: error.errors});
        }
        else {
            comment.save().then(function () {
                res.redirect('/quizes/' + req.params.quizId);
            });
        }
    })
    .catch(function (error) {
        next(error);   
    });
};