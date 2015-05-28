exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:9515/wd/hub',
  capabilities: {
    'browserName': 'phantomjs'
  },
  specs: ['stub.spec.js']
};