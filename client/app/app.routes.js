(function (ng) {
  ng.module('app')
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $routeProvider
      // display top listened genres and grid of genres
      .when('/genres', {
        templateUrl: 'app/components/genre/views/genres.html',
        controller: 'GenresCtrl',
        controllerAs: 'ctrl'
      })
      // display search result bygenres
      .when('/genres/search', {
        templateUrl: 'app/components/genre/views/genres-search.html',
        controller: 'GenresSearchCtrl',
        controllerAs: 'ctrl'
      })
      // display page for creating new genre: form, header preview and grid-cell preview
      .when('/genres/create', {
        templateUrl: 'app/components/genre/views/genre-create.html',
        controller: 'GenreCreateCtrl',
        controllerAs: 'ctrl',
        secure: true
      })
      // display genre page: image, name, description, top artists, top albums, top playlists
      .when('/genres/:genre', {
        templateUrl: 'app/components/genre/views/genre.html',
        controller: 'GenreCtrl',
        controllerAs: 'ctrl'
      })
      // display genre page: image, name, description, top artists, top albums, top playlists
      .when('/genres/:genre/edit', {
        templateUrl: 'app/components/genre/views/genre-view.html',
        controller: 'GenreEditCtrl',
        controllerAs: 'ctrl',
        secure: true
      })
      // display artists for this genre: sort by name or by rating, pagination
      .when('/genres/:genre/artists', {
        templateUrl: 'app/components/genre/views/genre-artists-view.html',
        controller: 'GenreArtistsCtrl',
        controllerAs: 'ctrl'
      })
      // display search results for artists in genre
      .when('/genres/:genre/artists/search', {
        templateUrl: 'app/components/genre/views/genre-artists-view.html',
        controller: 'GenreArtistsSearchCtrl',
        controllerAs: 'ctrl'
      })
      // display albums for this genre: sort by name or by rating, pagination
      .when('/genres/:genre/albums', {
        templateUrl: 'app/components/genre/views/genre-artists-view.html',
        controller: 'GenreAlbumsCtrl',
        controllerAs: 'ctrl'
      })
      // display search results for albums in genre
      .when('/genres/:genre/albums/search', {
        templateUrl: 'app/components/genre/views/genre-artists-view.html',
        controller: 'GenreAlbumsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/genres/:genre/playlists', {
        templateUrl: 'app/components/genre/views/genre-artists-view.html',
        controller: 'GenrePlaylistsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/genres/:genre/playlists/search', {
        templateUrl: 'app/components/genre/views/genre-artists-view.html',
        controller: 'GenrePlaylistsSearchCtrl',
        controllerAs: 'ctrl'
      })
      .when('/artists', {
        templateUrl: 'app/components/artist/views/artists.html',
        controller: 'ArtistsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/artists/search', {
        templateUrl: 'app/components/artist/views/artists.html',
        controller: 'ArtistsSearchCtrl',
        controllerAs: 'ctrl'
      })
      .when('/artists/create', {
        templateUrl: 'app/components/artist/views/artist-create.html',
        controller: 'ArtistCreateCtrl',
        controllerAs: 'ctrl',
        secure: true
      })
      .when('/artists/:artist', {
        templateUrl: 'app/components/artist/views/artist.html',
        controller: 'ArtistCtrl',
        controllerAs: 'ctrl'
      })
      .when('/artists/:artist/edit', {
        templateUrl: 'app/components/artist/views/artist-edit.html',
        controller: 'ArtistEditCtrl',
        controllerAs: 'ctrl',
        secure: true
      })
      .when('/albums', {
        templateUrl: 'app/components/albums/views/albums.html',
        controller: 'AlbumsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/albums/search', {
        templateUrl: 'app/components/albums/views/genre-artists-view.html',
        controller: 'AlbumsSearchCtrl',
        controllerAs: 'ctrl'
      })
      .when('/albums/create', {
        templateUrl: 'app/components/albums/views/genre-artists-view.html',
        controller: 'AlbumCreateCtrl',
        controllerAs: 'ctrl',
        secure: true
      })
      .when('/albums/:album', {
        templateUrl: 'app/components/albums/views/genre-artists-view.html',
        controller: 'AlbumCtrl',
        controllerAs: 'ctrl'
      })
      .when('/albums/:album/edit', {
        templateUrl: 'app/components/albums/views/genre-artists-view.html',
        controller: 'AlbumEditCtrl',
        controllerAs: 'ctrl',
        secure: true
      })
      .when('/songs/create', {
        templateUrl: 'app/components/albums/views/genre-artists-view.html',
        controller: 'AlbumCreateCtrl',
        controllerAs: 'ctrl',
        secure: true
      })
      .when('/songs/:song/edit', {
        templateUrl: 'app/components/albums/views/genre-artists-view.html',
        controller: 'AlbumEditCtrl',
        controllerAs: 'ctrl',
        secure: true
      })
      .otherwise({redirectTo:'/'});
    
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }])
})(window.angular);