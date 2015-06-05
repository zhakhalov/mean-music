exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    'browserName': 'phantomjs'
  },
  proxy: {
     proxyType: 'manual',
     httpProxy: 'localhost:8080',
     sslProxy: 'localhost:443'
  },
  specs: ['stub.spec.js']
};