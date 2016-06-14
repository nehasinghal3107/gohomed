// An example configuration file.
var HtmlReporter = require('protractor-html-screenshot-reporter');
var reporter = new HtmlReporter({
   baseDirectory: 'screenshots',
   docTitle: 'Orderzapp Test Reporter',
   docName:    'orderzapp-protractor-tests-report.html'
});
exports.config = {
  // Do not start a Selenium Standalone sever - only run this using chrome.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:9000',
  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['./e2e_test/**/register.spec.js'],
  // suites: {
  //   login: './e2e_test/index/*.spec.js',
  //   // search: ['tests/e2e/contact_search/**/*Spec.js']
  // },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000
  },

  onPrepare: function() {
      // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
      jasmine.getEnv().addReporter(new HtmlReporter({
         baseDirectory: 'screenshots'
      }));
   }

};
