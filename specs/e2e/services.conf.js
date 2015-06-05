module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    hostname: process.env.IP,
    port: 1212,
    runnerPort: 0,
    reporters: ['progress', 'html'],
    browsers: ['PhantomJS'],
    files: [
      'services.spec.js'
    ]
  });
};