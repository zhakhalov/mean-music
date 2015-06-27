(function (ng) {
  ng.module('app.model')
  .service('GenresSvc', [ '_', 'ResourceSvc', 'Genre',
    function GenresSvc ( _, ResourceSvc, Genre) {
      return new ResourceSvc(Genre);
    }])
  .service('ArtistsSvc', [ '_', 'ResourceSvc', 'Artist',
    function ArtistsSvc ( _, ResourceSvc, Artist) {
      return new ResourceSvc(Artist);
    }])
  .service('AlbumSvc', [ '_', 'ResourceSvc', 'Album',
    function AlbumSvc ( _, ResourceSvc, Album) {
      return new ResourceSvc(Album);
    }])
  .service('SongsSvc', [ '_', 'ResourceSvc', 'Song',
    function SongsSvc ( _, ResourceSvc, Song) {
      return new ResourceSvc(Song);
    }])
})(window.angular);