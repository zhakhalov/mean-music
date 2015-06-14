module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    hostname: process.env.IP,
    port: 1212,
    runnerPort: 0,
    reporters: ['progress', 'html'],
    browsers: ['PhantomJS'],
    proxies : {
      '/api': 'https://mean-music-zhakhalov.c9.io/api'
    },
    files: [
      '../../../client/bower_components/jquery/dist/jquery.js',
      '../../../client/bower_components/angular/angular.js',
      '../../../client/bower_components/angular-resource/angular-resource.js',
      '../../../client/bower_components/angular-messages/angular-messages.js',
      '../../../client/bower_components/angular-bootstrap/ui-bootstrap.js',
      '../../../client/bower_components/angular-bootstrap-slider/slider.js',
      '../../../client/js/app.js',
      '../../../client/js/constants.js',
      '../../../client/js/factories/auth.js',
      '../../../client/js/services/auth-svc.js',
      '../../../client/js/resources/artist-res.js',
      '../../../client/js/resources/album-res.js',
      '../../../client/js/resources/song-res.js',
      'media.spec.js'
    ]
  });
};