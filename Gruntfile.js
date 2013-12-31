
module.exports = function(grunt) {
  'use strict';

  // load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // create configureation object
  grunt.initConfig({

    handlebars: {
      compile: {
        options: {
          namespace: 'FistWallet.templates',

          // use filename without extension as key
          processName: function(filePath) {
            var pieces = filePath.split('/');
            return pieces[pieces.length - 1].split('.')[0];
          }

        },
        files: {
          'public/templates/compiled.js': 'public/templates/*.hbs'
        }
      }
    }

  });

}
