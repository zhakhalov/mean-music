module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: [
          'client/js/app.js',
          'client/js/constants.js',
          'client/js/factories/lodash.js',
          'client/js/factories/auth.js',
          'client/js/services/users-svc.js',
          'client/js/services/auth-svc.js',
          'client/js/controllers/auth-ctrl.js'
        ],
        dest: 'client/js/app.min.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify']);
};