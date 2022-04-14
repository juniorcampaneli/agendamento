const mongoose = require('mongoose');

const appointment = new mongoose.Schema({//esse é o esquema que será passado para o models nesse exemplo o App*Service.
    name: String,
    email: String,
    description: String,
    cpf: String,
    date: Date,
    time: String,
    finished: Boolean,
    notified: Boolean
});

module.exports = appointment;