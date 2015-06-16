
// ----- node_modules
var _ = require('lodash');

/**
 * Rate model.
 * @param {String|ObjectId} userId Id of rater.
 * @param {GenreModel|ArtistModel|AlbumModels|SongModel} model Model that will be rated.
 * @param {Number} rate Rate value.
 */
function rate (userId, model, rate) {
  var pull = _.find(model.raters, function (rater) {
    return userId == rater.userId;
  });
  // replace existing vote
  model.raters.pull(pull);
  model.raters.push({
    userId: userId,
    rate: rate 
  });
  model.rating = _.sum(model.raters.map(function (entry) { return entry.rate })) / model.raters.length;
}


// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = {
  rate: rate
};