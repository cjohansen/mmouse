module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'referee', 'browserify'],

    // list of files / patterns to load in the browser as globals
    files: [
      'node_modules/bane/lib/bane.js',
      'node_modules/lodash/dist/lodash.min.js'
    ],

    browserify: {
      debug: true,

      files: [
        'src/**/*.js',
        'test/**/*.js'
      ]
    },

    exclude: [],

    preprocessors: {
      "/**/*.browserify": "browserify"
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
