var mongoose = require('mongoose');

var GenreModel = require('../../models/genre-model.js');

var genre = new GenreModel({
  name: 'FBSDAHF      SASDFASJKDHKAJS            '
});

console.log(genre.toObject());